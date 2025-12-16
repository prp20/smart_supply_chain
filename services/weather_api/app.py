from fastapi import FastAPI
import random

app = FastAPI()

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
