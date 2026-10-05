import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000/api"

print("--- STARTING TESTS ---")

try:
    print("Testing GET /applications...")
    res = requests.get(f"{BASE_URL}/applications")
    if res.status_code == 200:
        print("GET /applications passed.")
    else:
        print(f"Failed: {res.status_code}")
except Exception as e:
    print(f"Exception connecting to API: {e}")
    sys.exit(1)

print("\nCreating temporary test application...")
new_app = {
    "company_name": "Test Company",
    "job_role": "Java Developer",
    "applied_date": "2026-10-05",
    "location": "Bangalore",
    "source": "Company Website",
    "status": "Applied"
}

res = requests.post(f"{BASE_URL}/applications", json=new_app)
if res.status_code == 201:
    print("POST /applications passed.")
    app_data = res.json()
    app_id = app_data["id"]
    print(f"Created application with ID {app_id}")
else:
    print(f"POST failed: {res.status_code} - {res.text}")
    sys.exit(1)

print(f"\nFetching application {app_id}...")
res = requests.get(f"{BASE_URL}/applications/{app_id}")
if res.status_code == 200:
    print("GET /applications/{id} passed.")
else:
    print(f"GET failed: {res.status_code}")
    sys.exit(1)

print(f"\nUpdating application {app_id}...")
update_app = new_app.copy()
update_app["status"] = "Interview"
res = requests.put(f"{BASE_URL}/applications/{app_id}", json=update_app)
if res.status_code == 200:
    print("PUT /applications/{id} passed.")
else:
    print(f"PUT failed: {res.status_code}")
    sys.exit(1)

print(f"\nDeleting application {app_id}...")
res = requests.delete(f"{BASE_URL}/applications/{app_id}")
if res.status_code == 204:
    print("DELETE /applications/{id} passed.")
else:
    print(f"DELETE failed: {res.status_code}")
    sys.exit(1)

print("\n--- ALL TESTS PASSED ---")
