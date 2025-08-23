
---

# Refract ➤
 > ~ AI Document Assistant

Agentic AI that reads cdocuments (Google Drive, PDFs, emails) and delivers clear answers with citations, along with concise custom reports.

> **Problem solved:** People often spend hours searching, cross-referencing, and summarizing information from multiple sources. Refract automates this process, providing reliable answers and actionable reports instantly.

---

## Features ➤

* **Document Ingestion:** Reads PDFs, emails, and files from Google Drive.
* **Conversational Queries:** Ask questions in natural language and get precise answers.
* **Cited Responses:** All answers reference the sources used.
* **Custom Reports:** Summarizes key insights into structured reports.
* **Cross-Document Reasoning:** Combines information from multiple sources to provide accurate answers.
* **Data Privacy:** All documents and generated insights remain within the organization; nothing is shared externally.

---

## How It Works ➤

1. **Collect Documents:** Gathers and indexes relevant company files.
2. **Process Queries:** Understands natural-language questions.
3. **Synthesize Information:** Compares and merges content from multiple documents.
4. **Generate Answers:** Produces clear, cited responses.
5. **Create Reports:** Summarizes insights into structured, actionable reports.

---

## Quick Start ➤

### 1. Environment Setup
All environment variables are in `.env.local`. Update the following values:
```bash
# Required: Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Your Convex deployment info (already set)
CONVEX_DEPLOYMENT=dev:proper-bandicoot-15
NEXT_PUBLIC_CONVEX_URL=https://proper-bandicoot-15.convex.cloud

# Generate a secure API key for backend
API_KEY=your-secure-random-api-key-here
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start development servers
npm run dev
```

---