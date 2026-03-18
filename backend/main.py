from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
import string

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}

class CreateSession(BaseModel):
    mode: str

class SendSignal(BaseModel):
    session_id: str
    signal: str

def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# ✅ Create Session
@app.post("/create_session")
def create_session(data: CreateSession):
    session_id = generate_code()
    sessions[session_id] = {
        "mode": data.mode,
        "current": {"lost": 0, "fast": 0, "got_it": 0, "boring": 0},
        "history": [],
        "ended": False
    }
    return {"session_id": session_id}

# ✅ Send Signal
@app.post("/send_signal")
def send_signal(data: SendSignal):
    session = sessions.get(data.session_id)
    if not session:
        return {"error": "Invalid session"}

    if data.signal not in ["lost", "fast", "got_it", "boring"]:
        return {"error": "Invalid signal"}

    session["current"][data.signal] += 1
    return {"message": "Response recorded"}

# ✅ Get Stats
@app.get("/stats/{session_id}")
def get_stats(session_id: str):
    session = sessions.get(session_id)
    if not session:
        return {"error": "Invalid session"}

    return session["current"]

# 🔁 Refresh (NO SAVE)
@app.post("/refresh/{session_id}")
def refresh(session_id: str):
    session = sessions.get(session_id)
    if not session:
        return {"error": "Invalid session"}

    session["current"] = {"lost": 0, "fast": 0, "got_it": 0, "boring": 0}
    return {"message": "Refreshed"}

# 🔁 End Topic (SAVE SNAPSHOT)
@app.post("/end_topic/{session_id}")
def end_topic(session_id: str):
    session = sessions.get(session_id)
    if not session:
        return {"error": "Invalid session"}

    session["history"].append(session["current"].copy())
    session["current"] = {"lost": 0, "fast": 0, "got_it": 0, "boring": 0}

    return {"message": "Topic saved"}

# 🏁 End Session (AGGREGATED)
@app.post("/end_session/{session_id}")
def end_session(session_id: str):
    session = sessions.get(session_id)
    if not session:
        return {"error": "Invalid session"}

    session["ended"] = True

    all_topics = session["history"] + [session["current"]]

    overall = {"lost": 0, "fast": 0, "got_it": 0, "boring": 0}

    for topic in all_topics:
        for key in overall:
            overall[key] += topic[key]

    return {
        "message": "Session ended",
        "topics": all_topics,
        "overall": overall
    }