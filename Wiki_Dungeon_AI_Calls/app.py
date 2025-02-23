import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
import openai
from openai import OpenAI

load_dotenv()  # This will load variables from .env into your environment
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", openai.api_key))

def generate_riddle(text):
    """
    Generates a riddle based on a Wikipedia page summary using OpenAI.

    Parameters:
        text (str): A short summary or key details about the Wikipedia page

    Returns:
        str: A riddle related to the content
    """
    prompt = f"You are a master riddle maker. I'm making a website that includes riddles of text summaries, allowing the user to guess the topic the riddle is about. Create a riddle that is the combination of everything in the attached summary. Do not include the name of the topic in the image. Do not put any text before or after the riddle.\n{text}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0.7,
    )
    
    riddle = response['choices'][0]['message']['content'].strip()
    return riddle


def scrape_wikipedia(url):
    """
    Fetches the name, summary, and first 5 relevant Wikipedia article links with riddles.

    Parameters:
        url (str): Wikipedia page URL

    Returns:
        dict: Contains 'name', 'summary', and 'links_and_riddles' (list of tuples with link and riddle)
    """
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch page"}

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the name (title) of the page
    name = soup.find("h1", {"id": "firstHeading"}).text.strip()

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

    # Generate a riddle for each link
    links_and_riddles = []
    for link in links:
        page_summary = get_page_summary(link)
        riddle = generate_riddle(page_summary)
        links_and_riddles.append((link, riddle))

    return {
        "name": name,
        "summary": summary,
        "links_and_riddles": links_and_riddles
    }


def get_page_summary(url):
    """
    Helper function to get the summary of a page. It gets the first paragraph of the page.

    Parameters:
        url (str): Wikipedia page URL

    Returns:
        str: A short summary or the first paragraph of the Wikipedia page.
    """
    response = requests.get(url)
    if response.status_code != 200:
        return "Unable to fetch page summary."

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the first paragraph
    for p in soup.find_all("p"):
        if p.text.strip():
            return p.text.strip()
    
    return "No summary available."

# Example Usage:
url = "https://en.wikipedia.org/wiki/Python_(programming_language)"
result = scrape_wikipedia(url)
print(result)
