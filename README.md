# health-insurance-assistant

## Description
We are building a health insurance assistant that focuses on fertility benefits available to the user. It helps them through their fertility journey, regardless of what point in the journey they enter the app at. It's goal is to make dealing with the insurance side of fertility care easier to understand and more cost effective. Core features would include:
- **Cost simulation/timing optimization**: AI-powered model predicts total out-of-pocket costs across fertility cycles (IVF, egg freezing, IUI, etc.); Advises when to start or delay cycles based on deductible resets, coverage limits, provider selection, and other cost-saving factors.
- **Fertility journey map/timeline**: Keep track of past and future treatments, with clickable points on the timeline that take you to timing optimization info, details on the procedure itself, how it relates to your specific coverage, etc.
- **Coverage Decoder**: Based on your insurance plan and location, the app translates fertility benefits into plain English (what's covered, what's excluded, what counts as "medically necessary," etc.). Personalized to your situation with automatic document parsing. 

## Prerequisites

### Node.js (version 18.0 or higher)
- Download from nodejs.org
- Verify installation: node --version

### npm (comes with Node.js)
- Verify installation: npm --version

### Python 3.8 or higher
- Download from [python.org](https://python.org)
- Verify installation: `python --version` or `python3 --version`

### pip (comes with Python)
- Verify installation: `pip --version` or `pip3 --version`

### Git
- Download from git-scm.com
- Verify installation: git --version

## Required API Keys and Services

### Firebase Account
- Create a Firebase project at Firebase Console
- Enable Firebase Authentication
- Enable Firestore Database
- Enable Firebase Storage

### Google Gemini API Key
- Get your API key from Google AI Studio

## NPM Dependencies
The following packages will be installed automatically when you run npm install:​
- **@emotion/react** (^11.14.0) - CSS-in-JS styling
- **@emotion/styled** (^11.14.1) - Styled components
- **@mui/lab** (^7.0.1-beta.19) - Material-UI lab components
- **@mui/material** (^7.3.5) - Material-UI components
- **openai** (^6.8.1) - OpenAI API client (legacy)
- **react-hook-form** (^7.66.0) - Form validation
- **formidable** (^3.5.1) - File upload handling
- **pdf-parse** (^1.1.1) - PDF document parsing
- **pdfjs-dist** (^4.0.379) - PDF.js library

## Python Dependencies
- **flask** (3.0.0) - Web framework for ML API
- **flask-cors** (4.0.0) - CORS support
- **pandas** (2.1.4) - Data manipulation
- **numpy** (1.26.2) - Numerical computing
- **scikit-learn** (1.3.2) - Machine learning
- **joblib** (1.3.2) - Model persistence
- **beautifulsoup4** (4.12.0) - Web scraping
- **requests** (2.31.0) - HTTP library

## Environment Variables Setup
Create a .env.local file in the fertility-assistant directory with the following variables:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

## Installation Steps
Clone the repository:
```
git clone https://github.com/shrads-4/health-insurance-assistant.git
cd health-insurance-assistant/fertility-assistant
```

Install dependencies:
```
npm install
```

Set up your environment variables as described above

Create and activate a virtual environment:
```
cd lib
python -m venv venv
```
On Windows
```
venv\Scripts\activate
```
On Mac/Linux
```
source venv/bin/activate
```

Install Python dependencies and start Flask API server:
```
pip install -r requirements.txt
python fertility_model.py
```
Keep the above terminal running, and in a new terminal, run the development server:
```
cd fertility-assistant
npm run dev
```

Open http://localhost:3000 in your browser


## Acknowledgments

- **Fertility pricing data** sourced from:
  - CCRM Fertility: https://www.ccrmivf.com/resources/fertility-financing-options/ivf-cost/
  - CNY Fertility: https://www.cnyfertility.com/ivf-cost/
  - FairHealth Consumer: https://www.fairhealth.org/states-by-the-numbers
  - FertilityIQ: https://www.fertilityiq.com/topics/ivf-costs
  - GoodRx Fertility Medications: https://www.goodrx.com/conditions/fertility

- **Technology Stack**:
  - [Next.js](https://nextjs.org/) - React framework
  - [Firebase](https://firebase.google.com/) - Authentication and database
  - [Google Gemini AI](https://deepmind.google/technologies/gemini/) - Document parsing and coverage decoder
  - [scikit-learn](https://scikit-learn.org/) - Machine learning model
  - [Hugging Face](https://huggingface.co/) - ML model hosting and deployment infrastructure
  - [Material-UI](https://mui.com/) - UI components

- **Machine Learning**:
  - Cost prediction model trained using Gradient Boosting Regressor
  - Dataset: 450+ real fertility treatment costs across NY, CA, and TX
  - Model performance: R² score ~0.979, MAE ~$804

- **Open Source Libraries**:
  - Flask & Flask-CORS for API server
  - pandas & NumPy for data processing
  - Beautiful Soup for web scraping
  - pdf-parse & pdfjs-dist for document processing
  - Firebase for data storage
