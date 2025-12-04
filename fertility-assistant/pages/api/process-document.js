import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function chunkText(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.length === 0) {
    return ['No text content extracted from document'];
  }
  
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    
    // Prevent infinite loop - if we're at the end, break
    if (end >= text.length) break;
    
    start = end - overlap;
    
    // Safety check to prevent infinite loop
    if (chunks.length > 10000) {
      console.error('Too many chunks generated, stopping');
      break;
    }
  }
  
  return chunks;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.file[0];
    const dataBuffer = fs.readFileSync(file.filepath);
    
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      try {
        // Use pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(dataBuffer),
          useSystemFonts: true,
        });
        
        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        
        console.log(`Processing PDF with ${numPages} pages`);
        
        // Extract text from all pages
        const textPromises = [];
        for (let i = 1; i <= numPages; i++) {
          textPromises.push(
            pdfDocument.getPage(i).then(page => 
              page.getTextContent().then(content => {
                const pageText = content.items.map(item => item.str).join(' ');
                return pageText;
              })
            )
          );
        }
        
        const pageTexts = await Promise.all(textPromises);
        text = pageTexts.join('\n\n');
        
        console.log(`Extracted ${text.length} characters from PDF`);
        
        if (!text || text.trim().length === 0) {
          text = 'PDF appears to be empty or contains only images. Please upload a text-based PDF.';
        }
        
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        throw new Error(`Failed to parse PDF: ${pdfError.message}`);
      }
      
    } else if (file.mimetype === 'text/plain') {
      text = dataBuffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const chunks = chunkText(text, 1000, 200);
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    return res.status(200).json({
      chunks,
      fileName: file.originalFilename,
      fileSize: file.size,
      textLength: text.length,
      numChunks: chunks.length
    });
  } catch (error) {
    console.error('Document processing error:', error);
    return res.status(500).json({ 
      error: 'Failed to process document',
      details: error.message 
    });
  }
}
