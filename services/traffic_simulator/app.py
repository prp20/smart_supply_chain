import time
import json
import random
from datetime import datetime
from road_network import ROADS

OUTPUT_FILE = "/data/traffic_stream.json"
TICK_SECONDS = 1
SIM_DURATION = 3600

def simulate():
    stream = []

    for t in range(SIM_DURATION):
        timestamp = datetime.utcnow().isoformat()

        for road, points in ROADS.items():
            lat, lng = points[len(points)//2]

            stream.append({
                "time": timestamp,
                "road": road,
                "lat": lat,
                "lng": lng,
                "intensity": round(random.uniform(0.2, 1.0), 2)
            })

        time.sleep(TICK_SECONDS)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(stream, f, indent=2)

if __name__ == "__main__":
    simulate()
