const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel, ShadingType } = require("docx");
const fs = require("fs");

// Helper: bold text run
const bold = (text, size = 24) => new TextRun({ text, bold: true, size, font: "Calibri" });
const normal = (text, size = 24) => new TextRun({ text, size, font: "Calibri" });
const code = (text, size = 22) => new TextRun({ text, size, font: "Consolas" });
const codeBold = (text, size = 22) => new TextRun({ text, bold: true, size, font: "Consolas" });

// Helper: heading paragraph
const heading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({ text, heading: level, spacing: { before: 300, after: 150 } });

const subheading = (text) => heading(text, HeadingLevel.HEADING_2);
const subsubheading = (text) => heading(text, HeadingLevel.HEADING_3);

// Helper: normal paragraph
const para = (children, spacing = {}) =>
  new Paragraph({ children: Array.isArray(children) ? children : [normal(children)], spacing: { after: 100, ...spacing } });

// Helper: code block paragraph
const codeLine = (text) =>
  new Paragraph({
    children: [code(text)],
    spacing: { after: 0 },
    indent: { left: 400 },
    shading: { type: ShadingType.SOLID, color: "F5F5F5" },
  });

const codeBlock = (lines) => lines.map((l) => codeLine(l));

// Helper: table
const cellShading = { type: ShadingType.SOLID, color: "E8E8E8" };
const headerCell = (text) =>
  new TableCell({
    children: [new Paragraph({ children: [bold(text, 22)] })],
    shading: cellShading,
    width: { size: 50, type: WidthType.PERCENTAGE },
  });
const dataCell = (text, fontName = "Calibri") =>
  new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 22, font: fontName })] })],
    width: { size: 50, type: WidthType.PERCENTAGE },
  });
const simpleTable = (headers, rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map(headerCell) }),
      ...rows.map((r) => new TableRow({ children: r.map((c) => dataCell(c)) })),
    ],
  });

// Helper: bullet point
const bullet = (text) =>
  new Paragraph({
    children: [normal(text)],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

// --- Build document sections ---
const sections = [];

// Title page content
sections.push(
  new Paragraph({ spacing: { before: 2000 } }),
  new Paragraph({
    children: [bold("UKS Feminist AI Platform", 52)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [bold("TFGBV Chatbot", 44)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [bold("Backend API Documentation", 36)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),
  new Paragraph({
    children: [normal("Version 1.0", 28)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [normal("March 2026", 28)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [normal("Base URL: http://localhost:3002", 24)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
  }),

  // Table of Contents heading
  heading("Table of Contents"),
  para("1. Overview"),
  para("2. Authentication"),
  para("3. User Authentication Endpoints"),
  para("   3.1  POST /api/auth/register"),
  para("   3.2  POST /api/auth/login"),
  para("   3.3  GET /api/auth/me"),
  para("4. Chat Endpoints"),
  para("   4.1  POST /api/chat"),
  para("   4.2  POST /api/save-message"),
  para("5. User History Endpoint"),
  para("   5.1  GET /api/user/history"),
  para("6. Admin Endpoints"),
  para("   6.1  POST /api/admin/login"),
  para("   6.2  POST /api/admin/change-password"),
  para("   6.3  GET /api/admin/messages"),
  para("7. Utility Endpoints"),
  para("   7.1  GET /api/test-db"),
  para("8. Error Response Reference"),
  para("9. Database Schema"),

  // ──────── 1. Overview ────────
  heading("1. Overview"),
  para("This document describes the backend REST API for the UKS Feminist AI Platform TFGBV Chatbot. The API is built with Next.js 14 API Routes and provides endpoints for AI-powered chat (5 modes), user authentication, chat history, and admin management."),
  para([bold("Base URL: "), normal("http://localhost:3002")]),
  para([bold("Content-Type: "), normal("application/json")]),
  para([bold("Total Endpoints: "), normal("10")]),
  new Paragraph({ spacing: { after: 100 } }),
  simpleTable(
    ["Category", "Count"],
    [
      ["User Authentication", "3 endpoints"],
      ["Chat & Messages", "2 endpoints"],
      ["User History", "1 endpoint"],
      ["Admin", "3 endpoints"],
      ["Utility", "1 endpoint"],
    ]
  ),

  // ──────── 2. Authentication ────────
  heading("2. Authentication"),
  para("The API uses JSON Web Tokens (JWT) for authentication. Tokens are issued upon successful login or registration and must be included in the Authorization header for protected endpoints."),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Token Format"),
  ...codeBlock(["Authorization: Bearer <JWT_TOKEN>"]),
  new Paragraph({ spacing: { after: 150 } }),
  subsubheading("Token Details"),
  simpleTable(
    ["Property", "Value"],
    [
      ["Library", "jsonwebtoken (npm)"],
      ["Secret", "JWT_SECRET environment variable"],
      ["User Token Expiry", "7 days"],
      ["Admin Token Expiry", "24 hours"],
      ["Hashing", "bcryptjs with 10 salt rounds"],
    ]
  ),
  new Paragraph({ spacing: { after: 150 } }),
  subsubheading("Protected Endpoints"),
  bullet("GET /api/auth/me"),
  bullet("GET /api/user/history"),
  bullet("POST /api/admin/change-password"),
  bullet("GET /api/admin/messages"),

  // ──────── 3. User Auth Endpoints ────────
  heading("3. User Authentication Endpoints"),

  // 3.1 Register
  subheading("3.1  POST /api/auth/register"),
  para("Registers a new user account and returns a JWT token."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/auth/register"],
      ["Method", "POST"],
      ["Authentication", "None"],
      ["Content-Type", "application/json"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "name": "string (required)",',
    '  "email": "string (required, unique)",',
    '  "password": "string (required, min 6 characters)"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  simpleTable(
    ["Field", "Type", "Required", "Description"],
    [
      ["name", "string", "Yes", "User's full name"],
      ["email", "string", "Yes", "Unique email address"],
      ["password", "string", "Yes", "Min 6 characters"],
    ].map((r) => r)
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (201)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "token": "eyJhbGciOi...",',
    '  "user": {',
    '    "id": "UUID",',
    '    "name": "string",',
    '    "email": "string"',
    "  }",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["400", "Name, email, and password are required", "Missing required fields"],
      ["400", "Password must be at least 6 characters", "Password too short"],
      ["409", "An account with this email already exists", "Duplicate email"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // 3.2 Login
  subheading("3.2  POST /api/auth/login"),
  para("Authenticates a user and returns a JWT token (7-day expiry)."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/auth/login"],
      ["Method", "POST"],
      ["Authentication", "None"],
      ["Content-Type", "application/json"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "email": "string (required)",',
    '  "password": "string (required)"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "token": "eyJhbGciOi...",',
    '  "user": {',
    '    "id": "UUID",',
    '    "name": "string",',
    '    "email": "string"',
    "  }",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["400", "Email and password are required", "Missing fields"],
      ["401", "Invalid email or password", "Wrong credentials"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // 3.3 Me
  subheading("3.3  GET /api/auth/me"),
  para("Verifies the current user's JWT token and returns user profile data."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/auth/me"],
      ["Method", "GET"],
      ["Authentication", "Required (Bearer token)"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Headers"),
  ...codeBlock(["Authorization: Bearer <JWT_TOKEN>"]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "user": {',
    '    "id": "UUID",',
    '    "name": "string",',
    '    "email": "string"',
    "  }",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["401", "Unauthorized", "Missing or malformed token"],
      ["401", "Invalid token", "Token verification failed"],
      ["500", "Internal server error", "Server error"],
    ]
  ),

  // ──────── 4. Chat Endpoints ────────
  heading("4. Chat Endpoints"),

  // 4.1 Chat
  subheading("4.1  POST /api/chat"),
  para("Main chat endpoint handling all five AI-powered modes. Uses OpenAI GPT-4 Turbo."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/chat"],
      ["Method", "POST"],
      ["Authentication", "None"],
      ["Content-Type", "application/json"],
      ["AI Model", "OpenAI GPT-4 Turbo"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "messages": [',
    "    {",
    '      "role": "user",',
    '      "content": "Your message here",',
    '      "timestamp": "2024-03-16T10:00:00.000Z"',
    "    }",
    "  ],",
    '  "language": "en",',
    '  "mode": "support"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Mode Values"),
  simpleTable(
    ["Mode", "Description"],
    [
      ["support", "Support Chat - Confidential conversations for TFGBV survivors"],
      ["analyzer", "Content Analyzer - Reviews text based on feminist guidelines"],
      ["bias-detector", "Bias Detector - Identifies gender-biased language"],
      ["feminist-lens", "Feminist Lens - Scans for representation gaps"],
      ["rewrite-engine", "Rewrite Engine - Transforms exclusionary language"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Language Values"),
  simpleTable(
    ["Code", "Language"],
    [
      ["en", "English"],
      ["ur", "Urdu"],
      ["sd", "Sindhi"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response - Support Mode (200)"),
  ...codeBlock([
    "{",
    '  "message": "AI response text"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response - Analysis Modes (200)"),
  ...codeBlock([
    "{",
    '  "revisedText": "Revised/improved content here",',
    '  "analysis": [',
    "    {",
    '      "originalSnippet": "Problematic phrase from input",',
    '      "issueType": "Gender-Sensitivity",',
    '      "explanation": "Why this is an issue",',
    '      "suggestion": "How to fix it"',
    "    }",
    "  ]",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Issue Types (Analysis Modes)"),
  simpleTable(
    ["Issue Type", "Description"],
    [
      ["Grammar", "Grammar and language errors"],
      ["Tone", "Inappropriate or insensitive tone"],
      ["Gender-Sensitivity", "Gender-insensitive language"],
      ["Factual Clarity", "Unclear or inaccurate statements"],
      ["Bias", "Gender-biased language"],
      ["Representation", "Missing representation of marginalized groups"],
      ["Inclusivity", "Exclusionary language or framing"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["500", "Failed to parse AI response. The model did not return valid JSON.", "JSON parsing failure in analysis mode"],
      ["500", "Failed to process chat message", "General server/API error"],
    ]
  ),

  // 4.2 Save Message
  subheading("4.2  POST /api/save-message"),
  para("Persists a chat message to the MySQL database with session and environment tracking."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/save-message"],
      ["Method", "POST"],
      ["Authentication", "None"],
      ["Content-Type", "application/json"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "sessionId": "UUID (required)",',
    '  "mode": "support (required)",',
    '  "role": "user (required)",',
    '  "content": "Message text (required)",',
    '  "userId": "UUID (optional)",',
    '  "environment": "development (optional)"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  simpleTable(
    ["Field", "Type", "Required", "Description"],
    [
      ["sessionId", "UUID", "Yes", "Unique session identifier"],
      ["mode", "string", "Yes", "Chat mode (support|analyzer|bias-detector|feminist-lens|rewrite-engine)"],
      ["role", "string", "Yes", "Message sender (user|assistant)"],
      ["content", "string", "Yes", "Message content"],
      ["userId", "UUID", "No", "Logged-in user's ID"],
      ["environment", "string", "No", "Defaults to NEXT_PUBLIC_ENV"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "data": [',
    "    {",
    '      "id": "UUID",',
    '      "session_id": "UUID",',
    '      "user_id": "UUID or null",',
    '      "mode": "support",',
    '      "role": "user",',
    '      "content": "Message text",',
    '      "environment": "development",',
    '      "timestamp": "2024-03-16 10:00:00"',
    "    }",
    "  ]",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["400", "Missing required fields", "sessionId, mode, role, or content missing"],
      ["500", "Internal server error", "Database error"],
    ]
  ),

  // ──────── 5. User History ────────
  heading("5. User History Endpoint"),

  subheading("5.1  GET /api/user/history"),
  para("Fetches the authenticated user's chat sessions or messages for a specific session."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/user/history"],
      ["Method", "GET"],
      ["Authentication", "Required (Bearer token)"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Query Parameters"),
  simpleTable(
    ["Parameter", "Type", "Required", "Description"],
    [
      ["mode", "string", "No", "Filter by mode (support|analyzer|bias-detector|feminist-lens|rewrite-engine|all)"],
      ["session_id", "UUID", "No", "Get messages for a specific session"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response - Session List (200)"),
  para("When no session_id is provided:"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "sessions": [',
    "    {",
    '      "session_id": "UUID",',
    '      "mode": "support",',
    '      "started_at": "2024-03-16 10:00:00",',
    '      "last_message_at": "2024-03-16 10:30:00",',
    '      "message_count": 12',
    "    }",
    "  ]",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response - Session Messages (200)"),
  para("When session_id is provided:"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "messages": [',
    "    {",
    '      "id": "UUID",',
    '      "session_id": "UUID",',
    '      "user_id": "UUID",',
    '      "mode": "support",',
    '      "role": "user",',
    '      "content": "Message text",',
    '      "timestamp": "2024-03-16 10:00:00",',
    '      "environment": "development",',
    '      "created_at": "2024-03-16 10:00:00"',
    "    }",
    "  ]",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["401", "Unauthorized", "Missing bearer token"],
      ["401", "Invalid token", "Token verification failed"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // ──────── 6. Admin Endpoints ────────
  heading("6. Admin Endpoints"),

  // 6.1 Admin Login
  subheading("6.1  POST /api/admin/login"),
  para("Authenticates an admin user and returns a JWT token (24-hour expiry)."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/admin/login"],
      ["Method", "POST"],
      ["Authentication", "None"],
      ["Content-Type", "application/json"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "email": "admin@uksfeminist.ai",',
    '  "password": "Admin@123"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "token": "eyJhbGciOi...",',
    '  "admin": {',
    '    "id": "UUID",',
    '    "email": "admin@uksfeminist.ai"',
    "  }",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["400", "Email and password are required", "Missing fields"],
      ["401", "Invalid credentials", "Wrong email or password"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // 6.2 Change Password
  subheading("6.2  POST /api/admin/change-password"),
  para("Changes the admin user's password. Requires valid admin JWT token."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/admin/change-password"],
      ["Method", "POST"],
      ["Authentication", "Required (Bearer token)"],
      ["Content-Type", "application/json"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Request Body"),
  ...codeBlock([
    "{",
    '  "currentPassword": "string (required)",',
    '  "newPassword": "string (required, min 6 characters)"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "message": "Password changed successfully"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["400", "Current password and new password are required", "Missing fields"],
      ["400", "New password must be at least 6 characters", "Password too short"],
      ["401", "Unauthorized", "Missing bearer token"],
      ["401", "Invalid token", "Token verification failed"],
      ["401", "Current password is incorrect", "Wrong current password"],
      ["404", "User not found", "Admin not found in database"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // 6.3 Admin Messages
  subheading("6.3  GET /api/admin/messages"),
  para("Fetches stored chat messages with filtering and pagination. Requires admin JWT token."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/admin/messages"],
      ["Method", "GET"],
      ["Authentication", "Required (Bearer token)"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Query Parameters"),
  simpleTable(
    ["Parameter", "Type", "Default", "Description"],
    [
      ["mode", "string", "all", "Filter by mode (support|analyzer|bias-detector|feminist-lens|rewrite-engine|all)"],
      ["environment", "string", "NEXT_PUBLIC_ENV", "Filter by environment (development|production)"],
      ["limit", "number", "100", "Number of messages per page"],
      ["offset", "number", "0", "Pagination offset"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "messages": [',
    "    {",
    '      "id": "UUID",',
    '      "session_id": "UUID",',
    '      "user_id": "UUID or null",',
    '      "mode": "support",',
    '      "role": "user",',
    '      "content": "Message text",',
    '      "timestamp": "2024-03-16 10:00:00",',
    '      "environment": "development",',
    '      "created_at": "2024-03-16 10:00:00"',
    "    }",
    "  ],",
    '  "total": 250,',
    '  "limit": 100,',
    '  "offset": 0',
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Responses"),
  simpleTable(
    ["Status Code", "Error Message", "Cause"],
    [
      ["401", "Unauthorized", "Missing bearer token"],
      ["401", "Invalid token", "Token verification failed"],
      ["500", "Internal server error", "Server/database error"],
    ]
  ),

  // ──────── 7. Utility Endpoints ────────
  heading("7. Utility Endpoints"),

  subheading("7.1  GET /api/test-db"),
  para("Tests the MySQL database connection. Useful for debugging."),
  new Paragraph({ spacing: { after: 80 } }),
  simpleTable(
    ["Property", "Value"],
    [
      ["URL", "/api/test-db"],
      ["Method", "GET"],
      ["Authentication", "None"],
    ]
  ),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Success Response (200)"),
  ...codeBlock([
    "{",
    '  "success": true,',
    '  "message": "MySQL connection working!",',
    '  "adminUsersFound": 1,',
    '  "users": [',
    '    { "email": "admin@uksfeminist.ai" }',
    "  ]",
    "}",
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  subsubheading("Error Response (500)"),
  ...codeBlock([
    "{",
    '  "success": false,',
    '  "error": "error message",',
    '  "hint": "Make sure MySQL is running in XAMPP and the tfgbv database exists with the schema applied"',
    "}",
  ]),

  // ──────── 8. Error Response Reference ────────
  heading("8. Error Response Reference"),
  para("All error responses follow a consistent JSON format:"),
  ...codeBlock([
    "{",
    '  "error": "Human-readable error message"',
    "}",
  ]),
  new Paragraph({ spacing: { after: 150 } }),
  subsubheading("HTTP Status Codes Used"),
  simpleTable(
    ["Status Code", "Meaning", "When Used"],
    [
      ["200", "OK", "Successful request"],
      ["201", "Created", "Successful user registration"],
      ["400", "Bad Request", "Missing or invalid input fields"],
      ["401", "Unauthorized", "Missing, invalid, or expired JWT token"],
      ["404", "Not Found", "Resource not found (e.g., admin user)"],
      ["409", "Conflict", "Duplicate resource (e.g., email already registered)"],
      ["500", "Internal Server Error", "Unexpected server or database error"],
    ]
  ),

  // ──────── 9. Database Schema ────────
  heading("9. Database Schema"),
  para("The application uses MySQL with the following tables:"),
  new Paragraph({ spacing: { after: 100 } }),

  subsubheading("users"),
  simpleTable(
    ["Column", "Type", "Constraints"],
    [
      ["id", "UUID", "Primary Key"],
      ["name", "VARCHAR(255)", "NOT NULL"],
      ["email", "VARCHAR(255)", "UNIQUE, NOT NULL"],
      ["password_hash", "VARCHAR(255)", "NOT NULL"],
      ["created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP"],
    ]
  ),
  new Paragraph({ spacing: { after: 150 } }),

  subsubheading("chat_messages"),
  simpleTable(
    ["Column", "Type", "Constraints"],
    [
      ["id", "UUID", "Primary Key"],
      ["session_id", "UUID", "Indexed"],
      ["user_id", "UUID", "FK to users.id, nullable, Indexed"],
      ["mode", "ENUM", "support|analyzer|bias-detector|feminist-lens|rewrite-engine"],
      ["role", "ENUM", "user|assistant"],
      ["content", "TEXT", "NOT NULL"],
      ["timestamp", "DATETIME", "Indexed DESC"],
      ["environment", "ENUM", "development|production"],
      ["created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP"],
    ]
  ),
  new Paragraph({ spacing: { after: 150 } }),

  subsubheading("admin_users"),
  simpleTable(
    ["Column", "Type", "Constraints"],
    [
      ["id", "UUID", "Primary Key"],
      ["email", "VARCHAR(255)", "UNIQUE, NOT NULL"],
      ["password_hash", "VARCHAR(255)", "NOT NULL"],
      ["created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP"],
    ]
  ),
);

const doc = new Document({
  creator: "UKS Feminist AI Platform",
  title: "TFGBV Chatbot - Backend API Documentation",
  description: "Complete backend API documentation for the UKS Feminist AI Platform TFGBV Chatbot",
  sections: [{ children: sections }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("API_Documentation.docx", buffer);
  console.log("API_Documentation.docx created successfully!");
});
