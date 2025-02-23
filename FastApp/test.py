from typing import List
from fastapi import FastAPI
import app as hackathon_app
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



class Scrape_Wikipedia_Request(BaseModel):
  url: str

class Scrape_Wikipedia_Response(BaseModel):
  name: str = ""
  summary: str = ""
  links_and_riddles: list[tuple[str]] = []

@app.post("/scrape_wikipedia")
async def scrape_wikipedia(request: Scrape_Wikipedia_Request):
  app_result = hackathon_app.scrape_wikipedia(request.url)
  response = Scrape_Wikipedia_Response()
  response.name = app_result["name"]
  response.summary = app_result["summary"]
  response.links_and_riddles = app_result["links_and_riddles"]
  return response