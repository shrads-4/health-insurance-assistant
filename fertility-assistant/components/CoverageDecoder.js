import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { retrieveRelevantChunks } from '../lib/documentProcessor';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import styles from '../styles/CoverageDecoder.module.css';
import ReactMarkdown from 'react-markdown';

export default function CoverageDecoder() {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm Baby Yoda, your fertility insurance assistant.🐸
      \nI can help you:
      • Understand your insurance coverage
      • Find cost-saving opportunities
      • Explain complex insurance terms
      • Answer questions about fertility treatments
      \nYou can upload any confusing documents or just ask me questions!`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [documentChunks, setDocumentChunks] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or TXT file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // 1. Process document for Chat RAG
      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setDocumentChunks(data.chunks);
        setUploadedFileName(data.fileName);
        
        let assistantMessage = `✓ I've processed "${data.fileName}"! I now have access to your insurance plan details. Ask me anything about your coverage!`;

        // 2. Extract structured data for Cost Simulator (if PDF/Image)
        if (user && file.type === 'application/pdf') {
          try {
            // Need a fresh FormData for the second request or reuse if fetch doesn't consume it
            const extractFormData = new FormData();
            extractFormData.append('file', file);
            
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `🔄 Analyzing "${data.fileName}" to extract coverage details for the Cost Simulator...`
            }]);

            const extractResponse = await fetch('/api/extract-insurance-info', {
              method: 'POST',
              body: extractFormData
            });
            
            const extractResult = await extractResponse.json();
            
            if (extractResult.success && extractResult.data) {
              const d = extractResult.data;
              const parseNumber = (val) => {
                if (!val) return null;
                const parsed = parseFloat(val);
                return isNaN(parsed) ? null : parsed;
              };

              // Update user profile in Firestore
              const updates = {
                extractedInsuranceData: d
              };
              
              if (d.insuranceCarrier) updates.insuranceCarrier = d.insuranceCarrier;
              if (d.planName) updates.planName = d.planName;
              if (d.deductible?.individual) updates.deductible = parseNumber(d.deductible.individual);
              if (d.outOfPocketMax?.individual) updates.outOfPocketMax = parseNumber(d.outOfPocketMax.individual);
              // Note: extract-insurance-info doesn't currently extract coinsurance/coverageLimit specifically in the prompt shown
              // but we save what we have.
              
              await updateDoc(doc(db, 'users', user.uid), updates);
              
              assistantMessage += `\n\n✅ I've also updated your profile with the extracted coverage details (Deductible, Out-of-Pocket Max, etc.). You can see these in the Cost Simulator now!`;
            }
          } catch (extractError) {
            console.error('Auto-extraction failed:', extractError);
            // Don't fail the whole upload if extraction fails, just log it
          }
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage
        }]);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('File processing error:', error);
      alert('Error processing file. Please try again.');
    }
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Retrieve relevant chunks if document is uploaded
      let context = '';
      if (documentChunks.length > 0) {
        const relevantChunks = retrieveRelevantChunks(userMessage, documentChunks, 3);
        context = relevantChunks.join('\n\n---\n\n');
      }

      // Add user's insurance profile as context
      if (userProfile) {
        context += `\n\nUser's Insurance Profile:`;
        if (userProfile.insuranceCarrier) {
          context += `\n- Carrier: ${userProfile.insuranceCarrier}`;
        }
        if (userProfile.planName) {
          context += `\n- Plan: ${userProfile.planName}`;
        }
        if (userProfile.deductible) {
          context += `\n- Deductible: $${userProfile.deductible} (Met: $${userProfile.deductibleMet || 0})`;
        }
        if (userProfile.outOfPocketMax) {
          context += `\n- Out-of-Pocket Max: $${userProfile.outOfPocketMax}`;
        }
        if (userProfile.coinsurance) {
          context += `\n- Coinsurance: ${userProfile.coinsurance}%`;
        }
        if (userProfile.coverageLimit) {
          context += `\n- Fertility Coverage Limit: $${userProfile.coverageLimit}`;
        }
        if (userProfile.fertilityJourneyStage) {
          context += `\n- Journey Stage: ${userProfile.fertilityJourneyStage}`;
        }
      }

      const response = await fetch('/api/chat-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          conversationHistory: messages.slice(-6) // Last 3 exchanges
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${data.error}. Please try again.` 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble connecting. Please check your internet and try again.' 
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <div className={styles.headerContent}>
            <h2>Coverage Decoder Chat 💬</h2>
            {uploadedFileName && (
              <span className={styles.uploadedFile}>📄 {uploadedFileName}</span>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadButton}
            disabled={uploading || loading}
          >
            {uploading ? '⏳ Uploading...' : '📎 Upload Plan'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`${styles.message} ${styles[msg.role]}`}
            >
              <div className={styles.messageAvatar}>
                {msg.role === 'assistant' ? '🐸' : '👤'}
              </div>
              <div className={styles.messageContent}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageAvatar}>🐸</div>
              <div className={styles.messageContent}>
                <div className={styles.typing}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your coverage..."
            className={styles.input}
            rows={2}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            className={styles.sendButton}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳' : '→'}
          </button>
        </div>
      </div>

      <div className={styles.quickQuestions}>
        <h3>Quick Questions:</h3>
        <div className={styles.questionGrid}>
          <button onClick={() => setInput('What fertility treatments are covered by my plan?')}>
            What's covered?
          </button>
          <button onClick={() => setInput('How can I reduce my out-of-pocket costs for IVF?')}>
            How to save money?
          </button>
          <button onClick={() => setInput('Do I need pre-authorization for fertility treatments?')}>
            Pre-authorization needed?
          </button>
          <button onClick={() => setInput('What is my coverage limit for fertility treatments?')}>
            Coverage limits?
          </button>
          <button onClick={() => setInput('What is the difference between in-network and out-of-network providers?')}>
            Network differences?
          </button>
          <button onClick={() => setInput('How does my deductible affect fertility treatment costs?')}>
            Deductible impact?
          </button>
          <button onClick={() => setInput('What medications are covered under my pharmacy benefits?')}>
            Medication coverage?
          </button>
          <button onClick={() => setInput('When should I start treatment to maximize my insurance benefits?')}>
            Best timing?
          </button>
          <button onClick={() => setInput('What happens if my treatment fails? Is a second cycle covered?')}>
            Multiple cycles?
          </button>
          <button onClick={() => setInput('Are genetic testing and PGT covered by my insurance?')}>
            Genetic testing?
          </button>
          <button onClick={() => setInput('How do I appeal a denied fertility treatment claim?')}>
            Appeal process?
          </button>
          <button onClick={() => setInput('What documentation do I need for insurance approval?')}>
            Required documents?
          </button>
        </div>
      </div>
    </div>
  );
}