
import json
import urllib.request

API = "http://127.0.0.1:8000/predict"

tests = [
    # Time comparisons
    ("Early morning", "2026-11-16", 3, 10, 0, 0, 20),
    ("Morning rush", "2026-11-16", 8, 10, 0, 0, 20),
    ("Evening rush", "2026-11-16", 16, 10, 0, 0, 20),
    ("Night", "2026-11-16", 22, 10, 0, 0, 20),

    # Weather comparisons
    ("Clear", "2026-11-16", 16, 20, 0, 0, 10),
    ("Cloudy", "2026-11-16", 16, 20, 0, 0, 90),
    ("Rainy", "2026-11-16", 16, 15, 5, 0, 90),
    ("Snowy", "2026-11-16", 16, -5, 0, 2, 90),

    # Weekday comparisons
    ("Monday", "2026-11-16", 16, 10, 0, 0, 20),
    ("Friday", "2026-11-20", 16, 10, 0, 0, 20),
    ("Saturday", "2026-11-21", 16, 10, 0, 0, 20),
    ("Sunday", "2026-11-22", 16, 10, 0, 0, 20),
]

print("\nSMART TRAFFIC MODEL - TEST RESULTS")
print("=" * 75)
print(f"{'Scenario':<18} {'Traffic':>12} {'Congestion':>15}")
print("-" * 75)

for name, date, hour, temp, rain, snow, clouds in tests:
    payload = {
        "date": date,
        "hour": hour,
        "temp_c": temp,
        "rain_1h": rain,
        "snow_1h": snow,
        "clouds_all": clouds,
    }

    request = urllib.request.Request(
        API,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode())

        print(
            f"{name:<18} "
            f"{result['predicted_traffic']:>12,} "
            f"{result['congestion_level']:>15}"
        )
    except Exception as error:
        print(f"{name:<18} ERROR: {error}")

print("=" * 75)
