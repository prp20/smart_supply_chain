from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

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

# --- Traffic endpoint ---
@app.get("/traffic")
def get_traffic():
    with open("traffic.json", "r") as t:
        return json.load(t)

# --- AI Decisions endpoint ---
@app.get("/decisions")
def get_decisions():
    with open("decisions.json", "r") as d:
        return json.load(d)

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
