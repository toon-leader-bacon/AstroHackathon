from typing import List
from fastapi import FastAPI
# import app as hackathon_app
from Wiki_Dungeon_AI_Calls import app as hackathon_app
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

frontend_url = os.getenv("FRONTEND_URL")

origins = [
    "http://localhost:8000",
    "http://localhost:5173"
]

class Generate_Riddle_Request(BaseModel):
    text: str

class Generate_Riddle_Response(BaseModel):
    text: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello_world")
async def hello_world():
  return {"message": "Hello World"}


@app.get("/generate_riddle")
async def generate_riddle(request: Generate_Riddle_Request):
  response = Generate_Riddle_Response()
  response.text = hackathon_app.generate_riddle(request.text)
  return response

# @app.get("/generate_all_page_contents")
# async def generate_all_page_contents(request: Generate_All_Page_Contents_Request):
#   response = Generate_Riddle_Response()
#   response.text = hackathon_app.generate_riddle(request.text)
#   return response



# class Generate_All_Page_Contents_Request(BaseModel):
#   url: str

# class Generate_All_Page_Contents_Response(BaseModel):
#   name: str = ""
#   summary: str = ""
#   links_and_riddles: list[tuple[str]] = []

class Scrape_Wikipedia_Request(BaseModel):
  url: str

class Scrape_Wikipedia_Response(BaseModel): #update
  name: str = ""
  summary: str = ""
  main_image: str = ""
  links_riddles_and_sub_images: list[tuple[str]] = []

@app.post("/scrape_wikipedia")
async def scrape_wikipedia(request: Scrape_Wikipedia_Request): #update
  app_result = hackathon_app.scrape_wikipedia(request.url)
  print(f"finished: {app_result}")
  response = Scrape_Wikipedia_Response()
  response.name = app_result["name"]
  response.summary = app_result["summary"]
  response.main_image = app_result["main_image"]
  response.links_riddles_and_sub_images = app_result["links_riddles_and_sub_images"]
  return response