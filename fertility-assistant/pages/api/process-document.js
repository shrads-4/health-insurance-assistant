import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
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
    const fileBuffer = fs.readFileSync(file.filepath);
    
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else if (file.mimetype === 'text/plain') {
      text = fileBuffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const chunks = chunkText(text, 1000, 200);
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    return res.status(200).json({
      chunks,
      fileName: file.originalFilename,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Document processing error:', error);
    return res.status(500).json({ 
      error: 'Failed to process document',
      details: error.message 
    });
  }
}
