import json
import requests

# Load API key from JSON file
with open('config.json') as config_file:
    config = json.load(config_file)
    api_key = config['api_key']

# Example API URL
url = f"https://api.example.com/data?api_key={api_key}"

response = requests.get(url)
data = response.json()
print(data)