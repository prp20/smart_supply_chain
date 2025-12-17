import time
import json
from datetime import datetime
from road_network import ROADS

OUTPUT_FILE = "/data/vehicle_stream.json"
TICK_SECONDS = 1
SIM_DURATION = 3600  # 1 hour

vehicles = [
    {"id": 1, "road": "road_1", "index": 0},
    {"id": 2, "road": "road_2", "index": 0},
]

def simulate():
    stream = []

    for t in range(SIM_DURATION):
        timestamp = datetime.utcnow().isoformat()

        for v in vehicles:
            path = ROADS[v["road"]]
            v["index"] = (v["index"] + 1) % len(path)
            lat, lng = path[v["index"]]

            stream.append({
                "time": timestamp,
                "vehicle_id": v["id"],
                "lat": lat,
                "lng": lng,
                "road": v["road"]
            })

        time.sleep(TICK_SECONDS)
        print(stream)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(stream, f, indent=2)

if __name__ == "__main__":
    simulate()
