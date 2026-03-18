# Classroom Pulse: This is a simple real-time classroom feedback system I built to help teachers understand how students are feeling during a lecture.
---
## Why I built this
In most classes, teachers don’t really know if students are:
- confused
- bored
- following properly
Usually students don’t speak up, so I wanted to create something super quick and simple where they can just click a button and give feedback instantly.
---
## What it does
- Teacher creates a session
- Students join using a session ID
- Students send signals like:
  - I'm lost
  - Too fast
  - Got it
  - Boring
- Teacher sees live updates on a dashboard
There’s also a chart and a small insight system that tells the teacher what’s going on overall.
---
## Features
- Live feedback system (updates every few seconds)
- Pie chart visualization of responses
- Insight messages based on student behavior
- End Topic → saves that part of the lecture
- End Session → shows full summary of all topics
---
## How the insight works
I didn’t want to just show numbers, so I added some logic that checks patterns.
For example:
- If many students say "lost" → it suggests revising
- If "too fast" is high → it suggests slowing down
- If "boring" is high → it suggests making it more interactive
It’s simple logic, but it makes the system more useful.
---
## Tech stack
- React (frontend)
- FastAPI (backend)
- Chart.js (for graphs)
---
## How it works internally
Everything is session-based.
Each session stores:
- current responses
- topic history
- final session summary
Right now it uses in-memory storage (no database), since this is a prototype.
---
## Running locally
### Frontend
cd frontend \n
npm install \n
npm start
### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
