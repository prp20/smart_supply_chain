from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/vehicle/status")
def vehicle_status():
    return {
        "vehicle_id": f"VH-{random.randint(100,999)}",
        "latitude": round(random.uniform(12.8, 13.2), 6),
        "longitude": round(random.uniform(77.4, 77.8), 6),
        "speed_kmph": random.randint(30, 80),
        "fuel_level_percent": random.randint(20, 100),
        "eta_minutes": random.randint(10, 120)
    }
