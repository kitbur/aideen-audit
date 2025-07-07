#
# Recieve banner prices from HoYoverse API
#
# To run:
#    python scripts/getBanners.py
#

import requests
import json
import os

url = "https://api.ennead.cc/mihoyo/starrail/calendar"
dataFilePath = os.path.join(os.path.dirname(__file__), '..', 'data', 'banners.json')

def fetchBanners():
    print("Fetching banner data from ennead.cc...")

    try:
        response = requests.get(url)
        response.raise_for_status()
        print("Successfully fetched banner data.")
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to fetch banner data. {e}")
        return

    jsonData = response.json()
    banners = jsonData.get("banners", [])

    if not banners:
        print("Warning: No banners found in the response.")
        return

    os.makedirs(os.path.dirname(dataFilePath), exist_ok=True)

    with open(dataFilePath, 'w', encoding='utf-8') as f:
        json.dump(banners, f, indent=4, ensure_ascii=False)

    print(f"Success! {len(banners)} banners saved to {dataFilePath}.")

if __name__ == '__main__':
    fetchBanners()
