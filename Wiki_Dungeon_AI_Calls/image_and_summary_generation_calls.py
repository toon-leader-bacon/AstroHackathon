import json # OpenAI Python library to make API calls
import requests  # used to download images
import os  # used to access filepaths
from PIL import Image  # used to print and edit images # pip3 install Pillow
from bs4 import BeautifulSoup
from app import get_page_summary

# https://cookbook.openai.com/examples/dalle/image_generations_edits_and_variations_with_dall-e
#  IMPORT NEEDED STUFF BEFORE RUNNING CODE

# Bring in OpenAI SDK
import openai
from openai import OpenAI
# client = OpenAI()
# initialize OpenAI client
# client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", config['api_key']))

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

# print the directory to save to
# print(f"{image_dir=}")

def get_link_title(url):
    # Send a GET request to the URL
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


# Create a function that uses the name of the wiki article and its summary to create an image for it. 
def generate_summary_image(name, summary):
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
            model = "dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            style="natural",
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

# Create a function that uses the links and riddles of the hyperlinked articles in the main wiki article to create riddles for them. 
def generate_riddle_images(links_and_riddles):
    # response = requests.get(url)
    try: 

        for page_link in links_and_riddles: 

            # response = client.images.generate(
            #     prompt="A cute baby sea otter",
            #     n=2,
            #     size="1024x1024"
            # )
            # create an image

            #  get the title from the link
            link_title = get_link_title(page_link[0])
            #  get the summary of the link
            link_summary = get_page_summary(page_link[1])

            # set the prompt
            prompt = f"You are an artist specializing in cartoon artwork. I'm making a website that includes detailed, accurate cartoon images of text summaries. Create a detailed, accurate cartoon image that is the combination of everything in the attached summary. You should still create the image even if it is complex and layered. Do not explain the components of the image to me. Do not include the name of the topic in the image.\n{link_summary}"

            # call the OpenAI API
            generation_response = client.images.generate(
                model = "dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024",
                style="natural",
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