# 📊 STOCKR — AI Stock Sentiment Dashboard

An intelligent full-stack application that displays real-time stock news and provides AI-driven sentiment analysis for actionable market insights.

## 🧠 Overview

STOCKR is a microservices-based platform that aggregates stock news from multiple sources, analyzes sentiment using AI/ML models, and presents the results through an intuitive dashboard. The system integrates **Angular 17** (frontend), **ASP.NET Core** (backend), and **Python FastAPI** (AI microservice) to deliver real-time market intelligence.

---

## ⚙️ Tech Stack

### Frontend
- **Framework:** Angular 17 (standalone components)
- **Styling:** SCSS with CSS variables
- **Language:** TypeScript
- **State Management:** Signals
- **HTTP Client:** Angular HttpClient

### Backend
- **Framework:** ASP.NET Core 9 (C#)
- **Architecture:** Clean Architecture with CQRS
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT-based auth
- **Pattern:** Repository pattern with dependency injection

### AI Microservice (Planned)
- **Language:** Python 3.11+
- **Framework:** FastAPI
- **ML Libraries:** transformers, pandas, numpy
- **Purpose:** NLP sentiment analysis

---

## 📎 Architecture

```
┌─────────────────┐
│  Angular (FE)   │  Port 4200
│   Standalone    │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  ASP.NET (BE)   │  Port 5100
│   CQRS + DI     │  Swagger UI
└────────┬────────┘
         │ REST
         ▼
┌─────────────────┐
│  Python AI      │  Port 8000 (planned)
│   FastAPI       │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  News APIs      │
│  External       │
└─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **.NET SDK** 9.0+

### 1️⃣ Start the Backend

```bash
make run-backend
```

**API Running:** `http://localhost:5100`

**Swagger UI:** `http://localhost:5100/swagger`

**Test Login:** `POST /api/auth/login`
- Username: `jmrles`
- Password: `123`

### 2️⃣ Start the Frontend

```bash
make run-frontend
```

**Dashboard:** `http://localhost:4200`

### Supporting Commands

```bash
make backend-restore      # Restore .NET dependencies
make frontend-install     # Install npm packages
```

---

## 🗂️ Repository Structure

```
STOCKR/
├── frontend/                    # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/          # Feature pages
│   │   │   │   ├── home/
│   │   │   │   └── login/
│   │   │   ├── core/           # Core services
│   │   │   │   ├── auth/       # Auth service & guard
│   │   │   │   └── config/     # App configuration
│   │   │   ├── app.component.*
│   │   │   └── app.routes.ts
│   │   ├── assets/
│   │   └── index.html
│   ├── angular.json
│   └── package.json
│
├── backend/                     # .NET API
│   └── src/
│       ├── Stockr.Api/          # API layer
│       │   ├── Controllers/
│       │   ├── Contracts/
│       │   └── Program.cs
│       ├── Stockr.Application/  # Business logic
│       │   ├── Auth/
│       │   └── Common/
│       ├── Stockr.Domain/       # Domain models
│       └── Stockr.Infrastructure/ # External services
│
├── main.py                      # Python AI service (placeholder)
├── requirements.txt             # Python dependencies
├── Makefile                     # Build automation
└── README.md
```

---

## 🔑 Key Features

### ✅ Implemented
- User authentication with JWT
- Protected routes with auth guard
- Responsive dashboard UI
- Modern dark theme
- Swagger API documentation
- **Real-time stock price quotes** (Web scraping with fallback)
- **Auto-refreshing watchlist** (15-second intervals)

### 🔨 In Development
- Real-time news aggregation
- AI sentiment analysis
- Stock watchlist management
- Sentiment visualization charts
- Multi-stock comparison

### 🔮 Future Enhancements
- Topic categorization (earnings, product launches)
- Predictive sentiment modeling
- Export reports as PDF
- News source reliability scoring
- Push notifications for sentiment changes

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| GET | `/swagger` | API documentation |
| GET | `/api/stock/{symbol}` | Get real-time quote for single stock |
| GET | `/api/stock/multiple?symbols=AAPL,NVDA` | Get real-time quotes for multiple stocks |

More endpoints coming soon...

---

## 🔧 Development

### Backend Development
```bash
cd backend/src/Stockr.Api
dotnet run --urls http://localhost:5100
```

### Frontend Development
```bash
cd frontend
ng serve
```

### Kill Port Conflicts
If you get "address already in use" errors:
```bash
lsof -ti:5100 | xargs kill -9  # Backend
lsof -ti:4200 | xargs kill -9  # Frontend
```

---

## 🧑‍💻 Contributors

**Javier Morales** — Software Engineer  
*Frontend: Angular • Backend: ASP.NET Core • AI: Python*

---

## 📄 License

This project is open-source under the MIT License.

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Swagger/OpenAPI](https://swagger.io/docs/)
- [FastAPI](https://fastapi.tiangolo.com/)
