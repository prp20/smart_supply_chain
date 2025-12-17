from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from typing import List
import json

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

with open("route.json") as f:
    ROUTE = json.load(f)["geometry"]

@app.get("/traffic")
def get_traffic():
    """
    Inject traffic at random checkpoints on the route
    """
    traffic_points = []

    # Pick 5 random points from route
    sampled_points = random.sample(ROUTE, 5)

    for lng, lat in sampled_points:
        traffic_points.append({
            "lat": lat,
            "lng": lng,
            "intensity": random.uniform(0.8, 1.0)  # HIGH traffic
        })

    return traffic_points