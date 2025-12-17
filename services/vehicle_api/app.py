from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from ai_engine import generate_decisions
import random
import requests

OSRM_URL = "https://router.project-osrm.org/route/v1/driving"

app = FastAPI()

def get_route(start, end):
    coords = f"{start['lng']},{start['lat']};{end['lng']},{end['lat']}"
    url = f"{OSRM_URL}/{coords}?overview=full&geometries=geojson&steps=true"

    res = requests.get(url).json()
    route = res["routes"][0]

    return {
        "distance_km": route["distance"] / 1000,
        "duration_min": route["duration"] / 60,
        "geometry": route["geometry"]["coordinates"],
        "steps": [
            step["maneuver"]["location"]
            for leg in route["legs"]
            for step in leg["steps"]
        ]
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Vehicles endpoint with animation ---
@app.get("/vehicles")
def get_vehicles():
    with open("vehicles.json", "r") as f:
        vehicles = json.load(f)
    # Move vehicles along route
    for v in vehicles:
        v["current_index"] = (v["current_index"] + 1) % len(v["route"])
        v["latitude"], v["longitude"] = v["route"][v["current_index"]]
    return vehicles

# --- Routes endpoint ---
@app.get("/routes")
def get_routes():
    with open("routes.json", "r") as r:
        return json.load(r)

@app.post("/cal_route")
def calculate_route(data: dict):
    return get_route(data["start"], data["end"])

@app.post("/route_traffic")
def generate_route_traffic(route: dict):
    geometry = route.get("geometry", [])

    if not geometry:
        return []

    traffic_points = []

    # Inject traffic between 30%–50% of route
    start_idx = int(len(geometry) * 0.3)
    end_idx = int(len(geometry) * 0.5)

    for i in range(start_idx, end_idx):
        lng, lat = geometry[i]

        traffic_points.append({
            "lat": lat,
            "lng": lng,
            "intensity": round(random.uniform(0.7, 1.0), 2),
            "type": "congestion"
        })

    return traffic_points

# --- Traffic endpoint ---
@app.get("/traffic")
def get_traffic():
    with open("traffic.json", "r") as t:
        return json.load(t)

# --- AI Decisions endpoint ---
@app.get("/decisions")
def get_decisions():
    # mock traffic
    traffic = [
        {"lat": 12.97, "lng": 77.59, "intensity": random.random()}
        for _ in range(10)
    ]

    # mock weather
    weather = {
        "condition": random.choice(["clear", "rain"]),
        "temperature": random.randint(20, 35)
    }

    # mock vehicles
    vehicles = [{"id": i} for i in range(random.randint(3, 10))]

    decisions = generate_decisions(traffic, weather, vehicles)
    return decisions

# --- Weather simulation endpoint (optional) ---
@app.get("/weather")
def get_weather():
    # Random weather points (static for demo)
    weather = [
        {"lat": 12.975, "lng": 77.600},
        {"lat": 12.978, "lng": 77.603},
        {"lat": 12.973, "lng": 77.599}
    ]
    return weather

@app.get('/new_vehicles')
def get_new_vehicles():
    with open("temp_vehicles.json") as tv:
        return json.load(tv)
    
@app.get('/weather')
def get_weather():
    with open("temperature.json") as tp:
        return json.load(tp)