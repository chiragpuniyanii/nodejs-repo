# ⬡ NOVA Dashboard — Node.js Application

A unique, futuristic Node.js web application with **zero external dependencies**.

## 📁 Project Structure

```
nodeapp/
├── server.js          ← Node.js HTTP server + REST API
├── package.json
└── public/
    ├── index.html     ← Main HTML page
    ├── style.css      ← Futuristic dark theme CSS
    └── app.js         ← Frontend JavaScript (API calls, animations)
```

## 🚀 How to Run

```bash
node server.js
```

Then open → **http://localhost:3000**

## 🔌 REST API Endpoints

| Method   | Route                  | Description            |
|----------|------------------------|------------------------|
| GET      | `/api/stats`           | Server stats & memory  |
| GET      | `/api/messages`        | Get all messages       |
| POST     | `/api/messages`        | Add a new message      |
| DELETE   | `/api/messages/:id`    | Delete a message by ID |

## ✨ Features

- **Pure Node.js** — no Express, no npm install needed
- **Live Stats** — Node version, uptime, memory usage
- **Full CRUD** — create & delete messages via REST API
- **Particle Canvas** — animated background with WebGL-like effects
- **Responsive Design** — works on mobile, tablet, desktop
- **Dark futuristic UI** — custom CSS with neon accents
- **Real-time uptime clock** — updates every second

## 🛠️ Tech Stack

- Node.js `http` module (server)
- Vanilla HTML5, CSS3, JavaScript (frontend)
- Canvas API (particle animations)
- Google Fonts: Syne + DM Mono
