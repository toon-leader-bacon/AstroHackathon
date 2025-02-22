import json # OpenAI Python library to make API calls
import requests  # used to download images
import os  # used to access filepaths
from PIL import Image  # used to print and edit images

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

# response = requests.get(url)
try: 
    # response = client.images.generate(
    #     prompt="A cute baby sea otter",
    #     n=2,
    #     size="1024x1024"
    # )
    # create an image

    # set the prompt
    prompt = "A cyberpunk monkey hacker dreaming of a beautiful bunch of bananas, digital art"

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
    generated_image_name = "main_summary_image.png"  # any name you like; the filetype should be .png
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