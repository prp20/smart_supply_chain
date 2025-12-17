from datetime import datetime

def generate_decisions(traffic, weather, vehicles):
    decisions = []
    now = datetime.now().strftime("%H:%M:%S")

    # 🚗 Traffic-based decision
    heavy_traffic = any(t["intensity"] > 0.7 for t in traffic)
    if heavy_traffic:
        decisions.append({
            "time": now,
            "type": "traffic",
            "message": "Heavy traffic detected. AI suggests alternate routing."
        })

    # 🌧 Weather-based decision
    if weather["condition"] == "rain":
        decisions.append({
            "time": now,
            "type": "weather",
            "message": "Rain detected. AI recommends reducing vehicle speed."
        })

    # 🚚 Vehicle congestion
    if len(vehicles) > 5:
        decisions.append({
            "time": now,
            "type": "ai",
            "message": "High vehicle density. AI optimizing delivery sequence."
        })

    return decisions
