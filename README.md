# health-insurance-assistant

## Description
We are building a health insurance assistant that focuses on fertility benefits available to the user. It helps them through their fertility journey, regardless of what point in the journey they enter the app at. It's goal is to make dealing with the insurance side of fertility care easier to understand and more cost effective. Core features would include:
- Cost simulation/timing optimization: Model total out-of-pocket costs across fertility cycles (IVF, egg freezing, IUI, etc.); Advises when to start or delay cycles based on deductible resets or coverage limits or any other factors that could aid in reducing costs.
- Fertility journey map/timeline: to keep track of past and future treatments, with clickable points on the timeline that take you to timing optimization info, details on the procedure itself, how it relates to your specific coverage, etc.
- Coverage Decoder: based on your insurance plan, location, etc. the app translates fertility benefits into plain English (what’s covered, what’s excluded, what counts as “medically necessary,” etc.). Personalized to your situation. 

## Prerequisites

### Node.js (version 18.0 or higher)
- Download from nodejs.org
- Verify installation: node --version

### npm (comes with Node.js)
- Verify installation: npm --version

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
- @emotion/react (^11.14.0)
- @emotion/styled (^11.14.1)
- @mui/lab (^7.0.1-beta.19)
- @mui/material (^7.3.5)
- openai (^6.8.1)
- react-hook-form (^7.66.0)

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

Run the development server:
```
npm run dev
```

Open http://localhost:3000 in your browser
