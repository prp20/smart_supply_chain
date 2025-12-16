from fastapi import FastAPI
import random

app = FastAPI()

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
