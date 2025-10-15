The user wants me to create a comprehensive README.md file for their NextJS chatbot application. I'll need to include:

> The user wants me to create a comprehensive README.md file for their NextJS chatbot application. I'll need to include:
> 
> 1.  Project title and description
> 2.  Purpose of the project
> 3.  Features
> 4.  How to clone from GitHub
> 5.  Installation instructions
> 6.  Environment variables setup
> 7.  How to run the application
> 8.  Project structure
> 9.  Technologies used
> 10.  How to contribute
> 11.  License information
> 12.  Contact/support information
> 
> Based on the code provided, this appears to be a chatbot application focused on Technology-Facilitated Gender-Based Violence (TFGBV) support in Pakistan, with two modes: Support Chat and Content Analyzer. It supports multiple languages (English, Urdu, Sindhi) and allows document uploads for analysis.
> 
> Let me create a comprehensive README.md file that covers all these aspects.

TFGBV Support Chatbot
=====================

A comprehensive NextJS chatbot application designed to provide confidential support and information about Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. The application features two modes: a Support Chat for survivors and a Content Analyzer for journalists and content creators.

Table of Contents
-----------------

*   [Purpose](#purpose)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Installation](#installation)
*   [Environment Variables](#environment-variables)
*   [Running the Application](#running-the-application)
*   [Project Structure](#project-structure)
*   [API Endpoints](#api-endpoints)
*   [Contributing](#contributing)
*   [License](#license)
*   [Support](#support)

Purpose
-------

This chatbot serves two primary purposes:

1.  **Support Chat Mode**: Provides confidential support, information, and resources for women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. It offers guidance on digital safety, legal rights, reporting mechanisms, and available support services.
    
2.  **Content Analyzer Mode**: Assists journalists and content creators in reviewing and improving their content based on feminist, gender-sensitive, and media-sensitive parameters developed by Uks Research Centre.
    

Features
--------

### Support Chat Mode

*   Multilingual support (English, Urdu, Sindhi)
*   Confidential and private conversations
*   Emergency contact information
*   Quick action buttons for common queries
*   Culturally sensitive responses
*   Information about legal rights under Pakistani law
*   Digital safety guidance

### Content Analyzer Mode

*   Text analysis for gender sensitivity
*   Content revision suggestions
*   Document upload support (.docx files)
*   Structured feedback with explanations
*   JSON-formatted analysis results

### General Features

*   Responsive design for mobile and desktop
*   Mode switching between Support and Analyzer
*   Real-time chat interface
*   File upload capability for document analysis

Technologies Used
-----------------

*   **Frontend**: Next.js, React, Tailwind CSS
*   **Backend**: Next.js API Routes
*   **AI Integration**: OpenAI API
*   **File Processing**: Mammoth.js (for .docx file reading)
*   **Icons**: Lucide React

Installation
------------

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   OpenAI API key

### Clone from GitHub

bash

```git clone https://github.com/your-username/tfgbv-chatbot.git

cd tfgbv-chatbot```

### Install Dependencies

bash

```npm install

\# or

yarn install ```

### Environment Variables
---------------------

Create a `.env.local` file in the root of your project and add the following:

```
OPENAI\_API\_KEY=your\_openai\_api\_key\_here

To get an OpenAI API key:

1.  Visit [OpenAI's website](https://openai.com/)
2.  Sign up or log in to your account
3.  Navigate to the API section
4.  Generate a new API key
5.  Copy the key and add it to your `.env.local` file
```
## Running the Application
-----------------------

### Development Mode

bash
```
npm run dev

\# or

yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

bash

```

npm run build

npm start

\# or

yarn build

yarn start
```
Project Structure
-----------------

```
tfgbv-chatbot/

├── app/

│ ├── api/

│ │ └── chat/

│ │ └── route.js # API endpoint for chat functionality

│ ├── components/

│ │ └── TFGBVChatbot.jsx # Main chatbot component

│ ├── globals.css # Global styles

│ ├── layout.js # Root layout component

│ └── page.js # Home page component

├── public/ # Static assets

├── .env.local # Environment variables (not in git)

├── .gitignore # Git ignore file

├── package.json # Project dependencies and scripts

├── README.md # This file

└── tailwind.config.js # Tailwind CSS configuration
```
API Endpoints
-------------

### POST /api/chat

Handles chat requests for both Support and Analyzer modes.

**Request Body:**

json

```

{

"messages": \[

{

"role": "user",

"content": "Your message here",

"timestamp": "2023-10-15T19:05:15.000Z"

}

\],

"language": "en",

"mode": "support" // or "analyzer"

}
```
**Response (Support Mode):**

json
```

{

"message": "AI response here"

}
```
**Response (Analyzer Mode):**

json

```
{

"revisedText": "Revised content here",

"analysis": \[

{

"originalSnippet": "Original text snippet",

"issueType": "Gender-Sensitivity",

"explanation": "Explanation of the issue",

"suggestion": "Suggestion for improvement"

}

\]

}
```
Contributing
------------

We welcome contributions to improve the TFGBV Support Chatbot. Please follow these steps:

1.  Fork the repository
2.  Create a new branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

### Code Style Guidelines

*   Use ES6+ syntax
*   Follow React best practices
*   Maintain consistent indentation (2 spaces)
*   Write meaningful commit messages
*   Add comments for complex logic

License
-------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Support
-------

If you encounter any issues or have questions about the TFGBV Support Chatbot, please:

1.  Check the [Issues](https://github.com/your-username/tfgbv-chatbot/issues) page to see if your question has already been addressed
2.  Create a new issue with detailed information about the problem
3.  For security concerns, please email us at [security@example.com](mailto:security@example.com)

Acknowledgments
---------------

*   Uks Research Centre for providing the guidelines for the Content Analyzer
*   OpenAI for the powerful language model that powers this chatbot
*   All contributors who have helped improve this project

Disclaimer
----------

This chatbot provides information only and is not a substitute for professional legal or medical advice. For immediate danger, please call emergency services. The content is designed to be culturally sensitive for the Pakistani context, but users should consult local authorities for specific legal guidance.