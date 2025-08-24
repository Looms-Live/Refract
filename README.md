
<div align="center">
   <img src="public/assets/icon.svg" alt="RefractAI Logo" width="120" />
   <h1>RefractAI</h1>
         <p><strong>Next.js analytics assistant with secure, role-based company data insights powered by Clerk authentication, Convex (app/user data), and remote SQL (company data)</strong></p>
</div>

---

## Overview


RefractAI is an analytics assistant that connects to remote company SQL databases, interprets natural language queries using LLMs, and enforces strict access control via Clerk authentication. Convex is used for app and user data storage, while company data remains in your existing SQL databases. The backend is built with Python for scalable, secure data processing and visualization.

---




## Features

- **Natural Language to Data:** Ask questions like “What were our sales in February?” and get tables or graphs.
- **Role-Based Access Control (RBAC):** Restricts sensitive data (e.g., salaries) based on user roles (Employee, Manager, Admin).
- **Secure Architecture:** Clerk handles authentication, Python backend enforces policies, and LLM never accesses raw data directly.
- **Remote SQL Database Support:** Connects to company-hosted MySQL/PostgreSQL servers without altering their schema.
- **Convex Database:** Stores app and user data (IDs, roles, preferences, etc.) securely with real-time sync and access control.
- **Interactive Visualizations:** Graphs generated in Python and displayed in the Next.js frontend.

---


## Architecture

<div align="center">
   <img src="public/assets/architecture.svg" alt="RefractAI Architecture Diagram" width="600" />
</div>

- **Frontend:** Next.js, TailwindCSS, Clerk Auth UI
- **Backend:** Python (FastAPI/Flask)
- **Database (Auth/App):** Clerk (managed user auth), Convex (user/app data)
- **Database (Company Data):** Remote MySQL/PostgreSQL
- **AI:** OpenAI/other LLM for natural language query interpretation
- **Visualization:** Matplotlib/Plotly (Python) rendered to frontend

---

## Setup




### 1. Frontend (Next.js + Clerk)
```bash
# Clone the repo
$ git clone https://github.com/your-org/refractAI.git
$ cd refractAI/frontend

# Install dependencies
$ npm install

# Configure environment
$ cp .env.example .env.local # Add Clerk and Convex keys

# Start development server
$ npm run dev
```

### 2. Backend (Python)
```bash
# Clone the repo
$ cd refractAI/backend
# Install dependencies
$ pip install -r requirements.txt
# Run the backend
$ python app.py
```

#### Configure your credentials in `.env`:
```env
DB_HOST=your-company-db.com
DB_USER=username
DB_PASS=password
DB_NAME=company_db
CONVEX_URL=your-convex-url
CONVEX_ADMIN_KEY=your-convex-admin-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

---

## Usage

1. **Login** with your company credentials (via Clerk).
2. **Ask a question** like:
   > What are the total sales for March?
3. **View results** as tables or graphs in real time.
4. **Access control enforced:**
   - Employees see only their data
   - Managers see their team’s data
   - Admins see everything

---




## Security

- **JWT Verification:** Every request to the backend includes a Clerk-signed JWT.
- **Role Enforcement:** Python backend checks role before running queries and enforces Convex access policies for app/user data, and SQL access policies for company data.
- **LLM Safety:** LLM never executes queries directly; backend sanitizes and modifies them.

---

## Future Enhancements




- Add support for multiple LLM providers.
- Integrate with BI dashboards like Metabase/Looker.
- Offline mode for periodic reports using Convex and SQL.
