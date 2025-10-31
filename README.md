# STOCKR — FastAPI microservice (minimal)

This repository contains a tiny FastAPI application with a single health endpoint and a small pytest test.

## Quick start — run the app

Prerequisites:
- Python 3.10+ installed

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the development server (uvicorn):

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The service will be available at http://127.0.0.1:8000. The health endpoint is at:

```
GET /health
```

Example:

```bash
curl -sS http://127.0.0.1:8000/health
# Expected JSON: {"message": "AI Service is running"}
```

## Run tests

This project includes a simple pytest test using FastAPI's TestClient.

With the virtual environment activated and dependencies installed:

```bash
pytest -q
```

You should see output similar to:

```
1 passed in 0.4s
```

## Notes
- `requirements.txt` includes `fastapi`, `uvicorn`, `pytest`, and `httpx` (httpx is required by the test client).
- The `venv/` folder is ignored in `.gitignore`.

If you'd like, I can add a simple GitHub Actions workflow to run the tests on push.
# 📊 AI Stock Sentiment Dashboard

## 🧠 Overview

The **AI Stock Sentiment Dashboard** is a full-stack application designed to display **real-time stock news** and provide **AI-driven sentiment analysis** (positive vs. negative vs. neutral) for the last 24 hours.
The dashboard begins with **NVIDIA (NVDA)** as the default tracked stock but allows users to dynamically select and monitor other stocks.

The app integrates **Angular (frontend)**, **.NET (backend)**, and **Python (AI microservice)** to deliver an intelligent, real-time market insight platform.

---

## ⚙️ Tech Stack

### **Frontend (Client)**

* **Framework:** Angular 17
* **UI Library:** Angular Material
* **Language:** TypeScript
* **Features:**

  * Interactive stock search and selection
  * Real-time news display and sentiment visualization
  * Graphs and charts to show sentiment breakdowns over time
  * REST API integration with .NET backend

### **Backend (API Server)**

* **Framework:** ASP.NET Core 8 (C#)
* **Architecture:** RESTful API
* **Responsibilities:**

  * Manages API routes for frontend requests
  * Handles authentication (if needed)
  * Fetches and caches stock news data from external APIs
  * Communicates with Python AI service for sentiment analysis
  * Stores recent analyses and logs in a local database (SQL Server / SQLite)

### **AI Microservice (Sentiment Engine)**

* **Language:** Python 3.11+
* **Framework:** FastAPI
* **Libraries:**

  * `transformers` (for text classification models)
  * `requests`
  * `pandas`
  * `numpy`
* **Responsibilities:**

  * Processes incoming news data from .NET
  * Uses pretrained NLP models to determine sentiment (positive/negative/neutral)
  * Returns sentiment results and confidence scores back to the .NET API

---

## 📎 Architecture Overview

```
Angular (Frontend)
   │
   ▼
.NET API (Backend)
   │
   ▼
Python FastAPI (AI Sentiment Microservice)
   │
   ▼
External News APIs (e.g., NewsAPI, FinancialModelingPrep)
```

---

## 🚀 Key Features

1. **Stock Search & Selection**

   * Start with NVIDIA (NVDA)
   * Expandable to any stock symbol using dynamic input

2. **Real-Time News Feed**

   * Displays top articles from the last 24 hours
   * Automatically refreshes periodically

3. **AI Sentiment Analysis**

   * Analyzes the tone of each article using Python NLP models
   * Returns a sentiment score (Positive %, Negative %, Neutral %)

4. **Data Visualization**

   * Interactive charts using Angular Material or Chart.js
   * Sentiment trend graphs and overall stock sentiment index

5. **Expandable AI Capabilities**

   * Future additions:

     * Topic categorization (e.g., earnings, product launches)
     * Predictive stock sentiment modeling
     * AI summary of overall sentiment impact

---

## 🧠 Example Workflow

1. User opens the dashboard → defaults to NVIDIA.
2. Angular app sends a request to `.NET API` → `/api/news/nvda`.
3. `.NET API` fetches data from a **news provider** (e.g., NewsAPI.org).
4. `.NET API` sends article headlines and descriptions to the **Python AI microservice**.
5. **Python service** returns sentiment classifications with confidence scores.
6. `.NET API` aggregates and sends formatted results to **Angular**.
7. Angular visualizes the results in charts and sentiment summaries.

---

## 🧩 Repository Structure

You’ll have **three separate repositories** (or subfolders in a monorepo):

1. **frontend/** → Angular application
2. **backend/** → .NET Core REST API
3. **ai-service/** → Python FastAPI microservice

```
ai-stock-sentiment-dashboard/
│
├── frontend/          # Angular app (UI)
│
├── backend/           # .NET API (business logic, routes)
│
└── ai-service/        # Python AI microservice (sentiment model)
```

---

## 🧮‍♂️ Setup & Run Locally

### 1️⃣ Clone All Repos

```bash
git clone https://github.com/<your-username>/ai-stock-dashboard-frontend.git
git clone https://github.com/<your-username>/ai-stock-dashboard-backend.git
git clone https://github.com/<your-username>/ai-stock-dashboard-ai-service.git
```

### 2️⃣ Run the AI Microservice (Python)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3️⃣ Run the .NET API

```bash
cd backend
dotnet restore
dotnet run
```

### 4️⃣ Run the Angular Frontend

```bash
cd frontend
npm install
ng serve
```

### 5️⃣ Access the App

Visit: `http://localhost:4200`

---

## 🔮 Future Enhancements

* Multi-stock sentiment comparison dashboard
* User authentication and saved watchlists
* Predictive modeling for stock sentiment trends
* News source reliability scoring
* Export sentiment reports as PDF

---

## 🧑‍💻 Contributors

**Javier Morales** — Software Engineer
*(Frontend: Angular, Backend: .NET, AI: Python FastAPI)*

---

## 📄 License

This project is open-source under the MIT License.
