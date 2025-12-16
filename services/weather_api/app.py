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


@app.get("/weather/current")
def weather():
    return {
        "city": "Bangalore",
        "temperature_c": round(random.uniform(18, 38), 1),
        "humidity_percent": random.randint(40, 90),
        "condition": random.choice(
            ["Sunny", "Rainy", "Cloudy", "Storm"]
        )
    }
