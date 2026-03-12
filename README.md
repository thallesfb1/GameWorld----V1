# 🌐 GameWorld

> **Explore 30+ video games mapped on an interactive 3D globe by their real-world geographic & historical origins.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Globe.gl](https://img.shields.io/badge/Globe.gl-2.27-6C5CE7)](https://globe.gl/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🌍 **Interactive 3D Globe** | All games rendered as colored pins on a rotating Earth |
| 🗺️ **Geographic Mapping** | Each game mapped to real-world coordinates |
| 📊 **Analytics Dashboard** | Continent & era distributions, global rankings |
| 🧑‍🚀 **Personal Stats** | Track games you've played, see your exploration % |
| 🏛️ **Historical Eras** | Games color-coded by historical era (Stone Age → Future) |
| 🔌 **IGDB Integration** | Auto-fetch covers & descriptions via the IGDB API |

---

## 🏗️ Architecture

```
GameWorld
├── backend/                    # Python FastAPI API
│   ├── app/
│   │   ├── main.py             # FastAPI app + all routes
│   │   ├── models.py           # SQLAlchemy ORM (SQLite)
│   │   ├── schemas.py          # Pydantic request/response models
│   │   ├── data/games.json     # 30+ game seed data
│   │   └── services/
│   │       ├── game_service.py
│   │       ├── stats_service.py
│   │       ├── analytics_service.py
│   │       ├── user_service.py
│   │       └── igdb_service.py
│   └── requirements.txt
│
└── frontend/                   # React + Vite SPA
    └── src/
        ├── App.jsx
        ├── index.css           # Premium dark glassmorphism design
        ├── components/
        │   ├── Globe.jsx       # react-globe.gl 3D globe
        │   ├── GameModal.jsx   # Game detail modal
        │   ├── InsightsPanel.jsx  # Analytics sidebar
        │   └── UserStats.jsx   # Personal stats panel
        └── services/api.js     # API client
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App at http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/games` | All games with geographic data |
| `GET` | `/games/{id}` | Single game by ID |
| `GET` | `/stats` | Aggregate stats (totals, top country/genre) |
| `GET` | `/analytics/overview` | Continent & era distributions + rankings |
| `POST` | `/user/{id}/played` | Mark game as played |
| `DELETE` | `/user/{id}/played/{game_id}` | Unmark game |
| `GET` | `/user/{id}/stats` | Personal user statistics |

---

---

## 🔑 IGDB Integration (Part 5)

1. Register at [Twitch Developer](https://dev.twitch.tv/)
2. Create an app and get your `Client ID` + `Client Secret`
3. Get an access token via OAuth:
   ```bash
   curl -X POST "https://id.twitch.tv/oauth2/token" \
     -d "client_id=YOUR_ID&client_secret=YOUR_SECRET&grant_type=client_credentials"
   ```
4. Set `IGDB_CLIENT_ID` and `IGDB_ACCESS_TOKEN` in your `.env` file

---

## 🎮 Game Data

30+ games mapped across **18+ countries**, **5 continents**, and **15+ historical eras** including:

- 🏛️ Ancient Egypt, Greece, Rome
- ⚔️ Viking Age, Feudal Japan, Sengoku Period  
- 🗺️ Wild West, Medieval Europe
- 🚀 Near Future, Post-Apocalyptic, Dystopian Future

---

*Built with ❤️ — FastAPI + React + Globe.gl*
