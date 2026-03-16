# UKS Feminist AI Platform — TFGBV Chatbot

A Next.js chatbot application developed for the **Uks Research Centre** to provide confidential support for women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan, along with AI-powered content analysis tools for journalists and content creators.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Admin Dashboard](#admin-dashboard)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

### 1. Support Chat Mode

- Confidential conversations for survivors of TFGBV
- Emergency contact information (helplines in English, Urdu, and Sindhi)
- Quick action buttons for common queries
- Guidance on Pakistani law, digital safety, and reporting mechanisms
- Culturally sensitive and empathetic responses
- Dark mode support

### 2. Content Analyzer Mode

- Reviews text (headlines or full articles) based on feminist guidelines
- Provides revised content with structured feedback
- Identifies tone, gender-sensitivity, grammar, and factual clarity issues
- Supports `.docx` file uploads via Mammoth.js
- JSON-formatted analysis results

### 3. Bias Detector Mode

- Identifies gender-biased language (e.g., "emotional" vs "expressive")
- Flags terms disproportionately applied to women
- Leverages 30-year archive of Pakistani journalism
- Suggests neutral alternatives

### 4. Feminist Lens Mode

- Scans content for representation gaps (missing women's/marginalized voices)
- Based on Uks' Gynae Feminism project
- Suggests inclusive additions to content

### 5. Rewrite Engine Mode

- Transforms exclusionary language in job ads, posters, and other content
- Examples: "salesman" → "salesperson", "hygienic Muslim girls" → "health-conscious youth"
- Maintains original intent while ensuring inclusivity

### General

- Multilingual support (English, Urdu, Sindhi)
- Responsive design for mobile and desktop
- Dark mode toggle
- Real-time chat interface with session tracking
- File upload capability for `.docx` document analysis
- All messages persisted to MySQL database

## Technologies Used

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | Next.js 14, React 18, Tailwind CSS |
| Backend          | Next.js API Routes                  |
| AI / LLM        | OpenAI API (GPT-4 Turbo)           |
| Database         | MySQL 2                             |
| Authentication   | JWT + bcryptjs                      |
| File Processing  | Mammoth.js                          |
| Icons            | Lucide React                        |
| Session Tracking | UUID                                |

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- MySQL server (XAMPP recommended for local development)
- OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tfgbv-chatbot.git
cd tfgbv-chatbot
```

### 2. Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Environment
NEXT_PUBLIC_ENV=development

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# MySQL (XAMPP)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=tfgbv

# JWT Secret (generate your own for production)
JWT_SECRET=your_jwt_secret_here
```

To get an OpenAI API key, visit [OpenAI's platform](https://platform.openai.com/), sign in, and generate a new key under the API section.

## Database Setup

1. Start MySQL via XAMPP (or your preferred MySQL server).
2. Import the schema file into your database:

```bash
mysql -u root -p tfgbv < mysql-schema.sql
```

Or import `mysql-schema.sql` through phpMyAdmin.

This creates the following tables:

- **`chat_messages`** — stores all chat interactions (indexed by session ID, mode, environment, and timestamp)
- **`admin_users`** — stores admin credentials with bcrypt-hashed passwords

**Default admin account:**

- Email: `admin@uksfeminist.ai`
- Password: `Admin@123`

> Change these credentials immediately in production.

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
tfgbv-chatbot/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.jsx        # Admin dashboard (sessions & messages)
│   │   └── login/page.jsx            # Admin login page
│   ├── api/
│   │   ├── chat/route.js             # Main chat API (all 5 modes)
│   │   ├── save-message/route.js     # Persist messages to MySQL
│   │   ├── test-db/route.js          # Database connection test
│   │   └── admin/
│   │       ├── login/route.js        # Admin authentication
│   │       ├── messages/route.js     # Fetch messages (JWT protected)
│   │       └── change-password/route.js
│   ├── components/
│   │   └── TFGBVChatbot.jsx          # Main chatbot UI component
│   ├── page.tsx                      # Home page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── lib/
│   └── db.js                         # MySQL connection pool
├── public/
│   └── uks-logo.jpg                  # Logo asset
├── mysql-schema.sql                  # Database schema
├── generate-admin-hash.js            # Utility to generate password hashes
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── package.json
└── tsconfig.json
```

## API Endpoints

### POST `/api/chat`

Handles chat requests for all five modes.

**Request:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here",
      "timestamp": "2024-03-16T10:00:00.000Z"
    }
  ],
  "language": "en",
  "mode": "support"
}
```

| `mode` value      | Description            |
| ------------------ | ---------------------- |
| `support`          | Support Chat           |
| `analyzer`         | Content Analyzer       |
| `bias-detector`    | Bias Detector          |
| `feminist-lens`    | Feminist Lens          |
| `rewrite-engine`   | Rewrite Engine         |

**Response (Support Mode):**

```json
{
  "message": "AI response text"
}
```

**Response (Analysis Modes):**

```json
{
  "revisedText": "Revised content here",
  "analysis": [
    {
      "originalSnippet": "Original text",
      "issueType": "Gender-Sensitivity",
      "explanation": "Why this is an issue",
      "suggestion": "How to fix it"
    }
  ]
}
```

### POST `/api/save-message`

Saves a chat message to the MySQL database with session and environment tracking.

### POST `/api/admin/login`

Authenticates an admin user and returns a JWT token (24-hour expiry).

### GET `/api/admin/messages`

Fetches stored messages. Requires `Authorization: Bearer <token>` header.

**Query parameters:** `mode`, `environment`, `limit`, `offset`

### POST `/api/admin/change-password`

Changes the admin password. Requires `Authorization: Bearer <token>` header.

## Admin Dashboard

Access the admin panel at `/admin/login`.

Features:

- View chat sessions filtered by mode and environment
- Two-column layout: session list + chat history
- Filter by mode (Support, Analyzer, Bias Detector, Feminist Lens, Rewrite Engine)
- Filter by environment (Development / Production)
- Change password functionality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- ES6+ syntax
- React best practices
- Consistent indentation (2 spaces)
- Meaningful commit messages

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Uks Research Centre** for providing feminist and gender-sensitive content guidelines
- **OpenAI** for the language model powering the chatbot

## Disclaimer

This chatbot provides information only and is not a substitute for professional legal or medical advice. For immediate danger, please call emergency services. The content is designed to be culturally sensitive for the Pakistani context, but users should consult local authorities for specific legal guidance.
