import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url):
    """
    Fetches the summary and first 5 relevant Wikipedia article links for WikiRacing.

    Parameters:
        url (str): Wikipedia page URL

    Returns:
        dict: Contains 'summary' and 'links' (first 5 relevant Wikipedia article URLs)
    """
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch page"}

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the summary (first paragraph)
    summary = None
    for p in soup.find_all("p"):
        if p.text.strip():
            summary = p.text.strip()
            break  # Get the first non-empty paragraph

    # Extract relevant Wikipedia article links
    links = []
    content_div = soup.find("div", {"id": "mw-content-text"})  # The main article content

    if content_div:
        for link in content_div.find_all("a", href=True):
            href = link["href"]

            # Ensure it's a valid Wikipedia article link
            if href.startswith("/wiki/") and ":" not in href and not href.startswith("/wiki/Main_Page"):
                full_url = "https://en.wikipedia.org" + href
                links.append(full_url)

            if len(links) == 5:  # Stop after getting 5 relevant links
                break

    return {"summary": summary, "links": links}

# Example Usage:
url = "https://en.wikipedia.org/wiki/Python_(programming_language)"
result = scrape_wikipedia(url)
print(result)
