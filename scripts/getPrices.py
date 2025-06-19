#
# Extract oneric shard prices from stardb.gg.
#
# This script uses the 'requests' library to download the webpage and
# 'BeautifulSoup' to parse the HTML and find the price data.
# It then saves the data into 'prices.json'.
#
# To run:
#    python scripts/getPrices.py
#

import requests
from bs4 import BeautifulSoup
import json
import os

url = "https://stardb.gg/en/posts/oneiric-shard-prices"
dataFilePath = os.path.join(os.path.dirname(__file__), '..', 'data', 'prices.json')

def getPrices():
    print("Fetching data from stardb.gg...")

    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print("Successfully fetched page content.")

    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to fetch the webpage. {e}")
        return

    soup = BeautifulSoup(response.content, 'html.parser')
    priceTable = soup.find('table', class_='responsive-table-desktop')

    if not priceTable:
        print("Error: Could not find the price table on the page.")
        return

    allPricesData = []
    tableBody = priceTable.find('tbody')
    rows = tableBody.find_all('tr')

    print(f"Found {len(rows)} regions in the table. Processing...")

    for row in rows:
        cols = row.find_all('td')
        
        if len(cols) == 10:
            region = cols[0].text.strip()
            passPriceText = cols[1].text.strip()
            # Extract the currency symbol
            currencySymbol = ''.join([c for c in passPriceText if not c.isdigit() and c not in '., ']).strip()
            
            def parsePrice(priceText):
                try:
                    # Remove currency symbols and commas, then convert to float
                    cleanedText = ''.join([c for c in priceText if c.isdigit() or c == '.']).strip()
                    return float(cleanedText) if cleanedText else None
                except (ValueError, TypeError):
                    return None

            regionData = {
                "region": region,
                "currency": currencySymbol,
                "prices": {
                    "pass": parsePrice(cols[1].text),
                    "glory": parsePrice(cols[2].text),
                    "medal": parsePrice(cols[3].text),
                    "shards60": parsePrice(cols[4].text),
                    "shards300": parsePrice(cols[5].text),
                    "shards980": parsePrice(cols[6].text),
                    "shards1980": parsePrice(cols[7].text),
                    "shards3280": parsePrice(cols[8].text),
                    "shards6480": parsePrice(cols[9].text)
                }
            }
            allPricesData.append(regionData)

    if not allPricesData:
        print("Warning: No data was extracted.")
        return
        
    os.makedirs(os.path.dirname(dataFilePath), exist_ok=True)

    with open(dataFilePath, 'w', encoding='utf-8') as f:
        json.dump(allPricesData, f, indent=4, ensure_ascii=False)

    print(f"Success! Data has been saved to '{dataFilePath}'.")

if __name__ == '__main__':
    getPrices()