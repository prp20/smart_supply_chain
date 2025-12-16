from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/traffic/status")
def traffic():
    return {
        "area": "City Center",
        "congestion_level": random.choice(
            ["Low", "Medium", "High"]
        ),
        "average_speed_kmph": random.randint(15, 60),
        "incident_reported": random.choice([True, False])
    }
