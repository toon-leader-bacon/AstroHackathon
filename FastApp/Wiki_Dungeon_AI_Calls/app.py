import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
import openai
from openai import OpenAI
# from image_and_summary_generation_calls import create_all_images_for_page
# from Wiki_Dungeon_AI_Calls.image_and_summary_generation_calls import create_all_images_for_page

import json  # OpenAI Python library to make API calls
import requests  # used to download images
import os  # used to access filepaths
from PIL import Image  # used to print and edit images # pip3 install Pillow
from bs4 import BeautifulSoup
# from app import get_page_summary


# call this before calling any other function.
def setup_ai_call_api():
  load_dotenv()  # This will load variables from .env into your environment
  openai.api_key = os.getenv("OPENAI_API_KEY")
  client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", openai.api_key))
  return client


def generate_riddle(text, client):
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

  riddle = response.choices[0].message.content
  return riddle


def scrape_wikipedia(url):
  # setup the api key
  client = setup_ai_call_api()
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
    riddle = generate_riddle(page_summary, client)
    links_and_riddles.append((link, riddle))

  # Generate all the images that are needed for the page and return a dictionary holding all the content that is needed to generate the page.
  # page_content = {"name": name, "summary":  summary, "main_image": main_image_file_path, "links_riddles_and_sub_images": links_riddles_and_sub_images}
  # links_riddles_and_sub_images = (link, riddle, sub_image)
  page_content = create_all_images_for_page(name, summary, links_and_riddles)
  return page_content

  # return {
  #     "name": name,
  #     "summary": summary,
  #     "links_and_riddles": links_and_riddles
  # }


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


def setup_ai_call_api_for_images():
  # Load API key from JSON file
  with open('config.json') as config_file:
    config = json.load(config_file)
    api_key = config['api_key']

  client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", config['api_key']))

  # # Example API URL
  # url = f"https://api.example.com/data?api_key={api_key}"

  # set a directory to save DALL E images to
  image_dir_name = "images"
  image_dir = os.path.join(os.curdir, image_dir_name)

  # create the directory if it doesn't yet exist
  if not os.path.isdir(image_dir):
    os.mkdir(image_dir)

  return client, str(image_dir).trim(".")

  # print the directory to save to
  # print(f"{image_dir=}")


def get_link_title(url):
  # Send a GET request to the URL
  # print(f"get_link_title: {url}")
  response = requests.get(url)
  # If the request was successful
  if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find and return the title tag content
    title = soup.title.string if soup.title else "No title found"
    return title
  else:
    return "Failed to retrieve the page"


def generate_summary_image(name, summary, client, image_dir):
  # response = requests.get(url)
  try:
    # response = client.images.generate(
    #     prompt="A cute baby sea otter",
    #     n=2,
    #     size="1024x1024"
    # )
    # create an image

    # set the prompt
    prompt = f"You are an artist specializing in realistic artwork. I'm making a website that includes detailed, accurate, realistic images of text summaries. Create a detailed, accurate, realistic image that is the combination of everything in the attached summary. You should still create the image even if it is complex and layered. Do not explain the components of the image to me.\n{summary}"

    # call the OpenAI API
    generation_response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
        # style="natural",
        response_format="url",
    )

    # print response
    # print(generation_response)

    # save the image
    generated_image_name = f"main_summary_of_{name}_image.png"  # any name you like; the filetype should be .png
    generated_image_filepath = os.path.join(image_dir, generated_image_name)
    generated_image_url = generation_response.data[0].url  # extract image URL from response
    generated_image = requests.get(generated_image_url).content  # download the image

    with open(generated_image_filepath, "wb") as image_file:
      image_file.write(generated_image)  # write the image to the file

  except openai.OpenAIError as e:
    print(e.http_status)
    print(e.error)

  # data = response.json()
  # print(data)

  # if response.status_code == 200:
  #     data = response.json()
  #     print(data)
  # else:
  #     print("Error:", response.status_code)


def generate_riddle_images(links_and_riddles, client, image_dir):
  # response = requests.get(url)
  try:

    for page_link in links_and_riddles:
      # print(f"generate_riddle_image: {page_link}")

      # response = client.images.generate(
      #     prompt="A cute baby sea otter",
      #     n=2,
      #     size="1024x1024"
      # )
      # create an image

      #  get the title from the link
      link_title = get_link_title(page_link[0])
      #  get the summary of the link
      link_summary = get_page_summary(page_link[0])

      # set the prompt
      prompt = f"You are an artist specializing in cartoon artwork. I'm making a website that includes detailed, accurate cartoon images of text summaries. Create a detailed, accurate cartoon image that is the combination of everything in the attached summary. You should still create the image even if it is complex and layered. Do not explain the components of the image to me. Do not include the name of the topic in the image.\n{link_summary}"

      # call the OpenAI API
      generation_response = client.images.generate(
          model="dall-e-3",
          prompt=prompt,
          n=1,
          size="1024x1024",
          response_format="url",
      )

      # print response
      # print(generation_response)

      # save the image
      generated_image_name = f"{link_title}_sub_page_image.png"  # any name you like; the filetype should be .png
      generated_image_filepath = os.path.join(image_dir, generated_image_name)
      generated_image_url = generation_response.data[0].url  # extract image URL from response
      generated_image = requests.get(generated_image_url).content  # download the image

      with open(generated_image_filepath, "wb") as image_file:
        image_file.write(generated_image)  # write the image to the file

  except openai.OpenAIError as e:
    print(e.http_status)
    print(e.error)

  # data = response.json()
  # print(data)

  # if response.status_code == 200:
  #     data = response.json()
  #     print(data)
  # else:
  #     print("Error:", response.status_code)


def if_main_image_exists(image_dir, name):
  # main_summary_of_{name}_image.png
  file_path = os.path.join(image_dir, f"main_summary_of_{name}_image.png")
  return os.path.exists(file_path)


def if_sub_image_exists(image_dir, link_title):
  # main_summary_of_{name}_image.png
  file_path = os.path.join(image_dir, f"{link_title}_sub_page_image.png")
  return os.path.exists(file_path)


def create_all_images_for_page(name, summary, links_and_riddles):
  client, image_dir = setup_ai_call_api_for_images()
  # Create a variable that holds the main image path.
  main_image_file_path = os.path.join(image_dir, f"main_summary_of_{name}_image.png")

  # Create a triple list that will hold the link, riddle, and sub image for each of this page's links/riddles.
  links_riddles_and_sub_images = []

  # If the images due not exist, generate them.
  if if_main_image_exists(image_dir, name) == False:
    print("main image does not exist")
    generate_summary_image(name, summary, client, image_dir)
    print("main image generated")

  for page in links_and_riddles:
    #  get the title from the link
    link_title = get_link_title(page[0])
    links_riddles_and_sub_images.append((page[0], page[1], os.path.join(image_dir, f"{link_title}_sub_page_image.png")))
    if if_sub_image_exists(image_dir, link_title) == False:
      print("sub image does not exist")
      generate_riddle_images(links_and_riddles, client, image_dir)
      print("sub image generated")

  # return a tuple containing the page name, summary, and links_riddles_and_sub_images tripple list.
  page_content = {"name": name, "summary": summary, "main_image": main_image_file_path,
                  "links_riddles_and_sub_images": links_riddles_and_sub_images}
  return page_content
