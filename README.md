<p>The user wants me to create a comprehensive README.md file for their NextJS chatbot application. I&#39;ll need to include:</p>
<blockquote>
<p>The user wants me to create a comprehensive README.md file for their NextJS chatbot application. I&#39;ll need to include:</p>
<ol>
<li>Project title and description</li>
<li>Purpose of the project</li>
<li>Features</li>
<li>How to clone from GitHub</li>
<li>Installation instructions</li>
<li>Environment variables setup</li>
<li>How to run the application</li>
<li>Project structure</li>
<li>Technologies used</li>
<li>How to contribute</li>
<li>License information</li>
<li>Contact/support information</li>
</ol>
<p>Based on the code provided, this appears to be a chatbot application focused on Technology-Facilitated Gender-Based Violence (TFGBV) support in Pakistan, with two modes: Support Chat and Content Analyzer. It supports multiple languages (English, Urdu, Sindhi) and allows document uploads for analysis.</p>
<p>Let me create a comprehensive README.md file that covers all these aspects.</p>
</blockquote>
<h1>TFGBV Support Chatbot</h1>
<p>A comprehensive NextJS chatbot application designed to provide confidential support and information about Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. The application features two modes: a Support Chat for survivors and a Content Analyzer for journalists and content creators.</p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#purpose">Purpose</a></li>
<li><a href="#features">Features</a></li>
<li><a href="#technologies-used">Technologies Used</a></li>
<li><a href="#installation">Installation</a></li>
<li><a href="#environment-variables">Environment Variables</a></li>
<li><a href="#running-the-application">Running the Application</a></li>
<li><a href="#project-structure">Project Structure</a></li>
<li><a href="#api-endpoints">API Endpoints</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#support">Support</a></li>
</ul>
<h2>Purpose</h2>
<p>This chatbot serves two primary purposes:</p>
<ol>
<li><p><strong>Support Chat Mode</strong>: Provides confidential support, information, and resources for women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. It offers guidance on digital safety, legal rights, reporting mechanisms, and available support services.</p>
</li>
<li><p><strong>Content Analyzer Mode</strong>: Assists journalists and content creators in reviewing and improving their content based on feminist, gender-sensitive, and media-sensitive parameters developed by Uks Research Centre.</p>
</li>
</ol>
<h2>Features</h2>
<h3>Support Chat Mode</h3>
<ul>
<li>Multilingual support (English, Urdu, Sindhi)</li>
<li>Confidential and private conversations</li>
<li>Emergency contact information</li>
<li>Quick action buttons for common queries</li>
<li>Culturally sensitive responses</li>
<li>Information about legal rights under Pakistani law</li>
<li>Digital safety guidance</li>
</ul>
<h3>Content Analyzer Mode</h3>
<ul>
<li>Text analysis for gender sensitivity</li>
<li>Content revision suggestions</li>
<li>Document upload support (.docx files)</li>
<li>Structured feedback with explanations</li>
<li>JSON-formatted analysis results</li>
</ul>
<h3>General Features</h3>
<ul>
<li>Responsive design for mobile and desktop</li>
<li>Mode switching between Support and Analyzer</li>
<li>Real-time chat interface</li>
<li>File upload capability for document analysis</li>
</ul>
<h2>Technologies Used</h2>
<ul>
<li><strong>Frontend</strong>: Next.js, React, Tailwind CSS</li>
<li><strong>Backend</strong>: Next.js API Routes</li>
<li><strong>AI Integration</strong>: OpenAI API</li>
<li><strong>File Processing</strong>: Mammoth.js (for .docx file reading)</li>
<li><strong>Icons</strong>: Lucide React</li>
</ul>
<h2>Installation</h2>
<h3>Prerequisites</h3>
<ul>
<li>Node.js (v18 or higher)</li>
<li>npm or yarn</li>
<li>OpenAI API key</li>
</ul>
<h3>Clone from GitHub</h3>
<pre><code class="language-bash">git clone https://github.com/your-username/tfgbv-chatbot.git
cd tfgbv-chatbot</code></pre>
<h3>Install Dependencies</h3>
<pre><code class="language-bash">npm install

# or

yarn install</code></pre>
<h2>Environment Variables</h2>
<p>Create a <code>.env.local</code> file in the root of your project and add the following:</p>
<pre><code>OPENAI_API_KEY=your_openai_api_key_here</code></pre>
<p>To get an OpenAI API key:</p>
<ol>
<li>Visit <a href="https://openai.com/">OpenAI&#39;s website</a></li>
<li>Sign up or log in to your account</li>
<li>Navigate to the API section</li>
<li>Generate a new API key</li>
<li>Copy the key and add it to your <code>.env.local</code> file</li>
</ol>
<h2>Running the Application</h2>
<h3>Development Mode</h3>
<pre><code class="language-bash">npm run dev

# or

yarn dev</code></pre>
<p>Open <a href="http://localhost:3002">http://localhost:3002</a> in your browser to view the application.</p>
<h3>Production Build</h3>
<pre><code class="language-bash">npm run build
npm start

# or

yarn build
yarn start</code></pre>
<h2>Project Structure</h2>
<pre><code>tfgbv-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js # API endpoint for chat functionality
│   ├── components/
│   │   └── TFGBVChatbot.jsx # Main chatbot component
│   ├── globals.css # Global styles
│   ├── layout.js # Root layout component
│   └── page.js # Home page component
├── public/ # Static assets
├── .env.local # Environment variables (not in git)
├── .gitignore # Git ignore file
├── package.json # Project dependencies and scripts
├── README.md # This file
└── tailwind.config.js # Tailwind CSS configuration</code></pre>
<h2>API Endpoints</h2>
<h3>POST /api/chat</h3>
<p>Handles chat requests for both Support and Analyzer modes.</p>
<p><strong>Request Body:</strong></p>
<pre><code class="language-json">{
  "messages": [
    {
      "role": "user",
      "content": "Your message here",
      "timestamp": "2023-10-15T19:05:15.000Z"
    }
  ],
  "language": "en",
  "mode": "support" // or "analyzer"
}</code></pre>
<p><strong>Response (Support Mode):</strong></p>
<pre><code class="language-json">{
  "message": "AI response here"
}</code></pre>
<p><strong>Response (Analyzer Mode):</strong></p>
<pre><code class="language-json">{
  "revisedText": "Revised content here",
  "analysis": [
    {
      "originalSnippet": "Original text snippet",
      "issueType": "Gender-Sensitivity",
      "explanation": "Explanation of the issue",
      "suggestion": "Suggestion for improvement"
    }
  ]
}</code></pre>
<h2>Contributing</h2>
<p>We welcome contributions to improve the TFGBV Support Chatbot. Please follow these steps:</p>
<ol>
<li>Fork the repository</li>
<li>Create a new branch (<code>git checkout -b feature/amazing-feature</code>)</li>
<li>Commit your changes (<code>git commit -m 'Add some amazing feature'</code>)</li>
<li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>
<li>Open a Pull Request</li>
</ol>
<h3>Code Style Guidelines</h3>
<ul>
<li>Use ES6+ syntax</li>
<li>Follow React best practices</li>
<li>Maintain consistent indentation (2 spaces)</li>
<li>Write meaningful commit messages</li>
<li>Add comments for complex logic</li>
</ul>
<h2>License</h2>
<p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>
<h2>Support</h2>
<p>If you encounter any issues or have questions about the TFGBV Support Chatbot, please:</p>
<ol>
<li>Check the <a href="https://github.com/your-username/tfgbv-chatbot/issues">Issues</a> page to see if your question has already been addressed</li>
<li>Create a new issue with detailed information about the problem</li>
<li>For security concerns, please email us at <a href="mailto:security@example.com">security@example.com</a></li>
</ol>
<h2>Acknowledgments</h2>
<ul>
<li>Uks Research Centre for providing the guidelines for the Content Analyzer</li>
<li>OpenAI for the powerful language model that powers this chatbot</li>
<li>All contributors who have helped improve this project</li>
</ul>
<h2>Disclaimer</h2>
<p>This chatbot provides information only and is not a substitute for professional legal or medical advice. For immediate danger, please call emergency services. The content is designed to be culturally sensitive for the Pakistani context, but users should consult local authorities for specific legal guidance.</p>