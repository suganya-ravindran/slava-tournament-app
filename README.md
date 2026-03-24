# 🏐 SLAVA Tournament App

> **Southern LA Volleyball Association** — Cloud-Based Tournament Management System

A fully serverless AWS application that replaces printed pool sheets and manual bracket boards with real-time digital score tracking, automated bracket seeding, and coach notifications.

---

## 🚀 Live App

**http://slava-tournament-app.s3-website-us-east-1.amazonaws.com**

---

## ✨ Features

- **Live Score Entry** — Site Directors enter match scores on mobile; updates broadcast instantly
- **Real-Time WebSocket** — Parents and players see live scores without refreshing the page
- **Auto Bracket Seeding** — Lambda calculates standings by wins then point differential
- **Reffing Reminders** — EventBridge fires every 15 minutes; coaches receive reminders before duty
- **Role-Based Access** — Cognito auth for directors; public read-only view for parents and players
- **Score Deletion** — Directors can remove incorrect score entries in real time

---

## 🗄️ DynamoDB Tables

| Table | Partition Key | Sort Key | Purpose |
|-------|--------------|----------|---------|
| Tournaments | tournamentId | — | Tournament details |
| Teams | teamId | tournamentId | Team registrations |
| Pools | poolId | tournamentId | Pool assignments |
| Scores | matchId | poolId | Match scores + results |
| Brackets | bracketId | tournamentId | Bracket draw + gym assignments |
| ReffingSchedule | scheduleId | tournamentId | Reffing duty assignments |
| Connections | connectionId | — | Active WebSocket connections |

---

## ⚡ Lambda Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| slava-scoreEntry | API Gateway GET/POST/DELETE | Save, fetch, and delete scores |
| slava-poolRankings | API Gateway GET | Calculate pool standings |
| slava-bracketSeeding | API Gateway GET/POST | Generate bracket draw |
| slava-reffingReminder | EventBridge every 15 min | Send reminders to coaches |
| slava-notifications | DynamoDB Streams | Broadcast score updates via WebSocket |

---

## 🌐 API Endpoints

### REST API
- POST /scores — Save a match score
- GET /scores — Fetch all scores
- DELETE /scores — Delete a score
- GET /pools/{poolId}/rankings — Get pool standings
- GET /brackets/{tournamentId} — Get bracket draw

### WebSocket API
- wss://4xv6sgx7b2.execute-api.us-east-1.amazonaws.com/prod/

---

## 💰 Cost Estimate

| Scenario | Monthly | Annual |
|----------|---------|--------|
| Email only | $0.00 | $0.00 |
| With SNS SMS | ~$2.26 | ~$27 |

---

## 🛠️ Project Structure
```
slava-tournament-app/
├── frontend/
│   └── src/
│       ├── components/Navbar.jsx
│       ├── pages/PoolScores.jsx
│       ├── pages/Brackets.jsx
│       ├── pages/ScoreEntry.jsx
│       ├── pages/Login.jsx
│       ├── aws-config.js
│       ├── App.jsx
│       └── main.jsx
├── backend/
│   └── functions/
│       ├── scoreEntry/
│       ├── poolRankings/
│       ├── bracketSeeding/
│       ├── reffingReminder/
│       └── notifications/
└── infrastructure/
```

---

## ⚙️ Deploy Frontend to S3
```bash
cd frontend
npm install
npm run build
aws s3 sync dist/ s3://slava-tournament-app --delete
```

---

## ⚠️ AWS Lab Restrictions

| Service | Restriction | Workaround |
|---------|------------|------------|
| CloudFront | Not authorized in lab | App served via S3 URL |
| SES | Not authorized in lab | Lambda code written, ready for production |
| SNS SMS | Not authorized in lab | SNS topic created, needs production account |

---

## 👩‍💻 Author

**Suganya Ravindran** — ITM 310 Module 05
Southern LA Volleyball Association · AWS Cloud Architecture · us-east-1
