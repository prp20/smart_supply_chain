from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from ai_engine import generate_decisions
import random

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