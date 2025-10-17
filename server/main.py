from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
import requests
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client[os.getenv("DB_NAME")]
users_collection = db["users"]
GPT_SERVER_URL = "https://gpt-server-node-agc7h0gbexc0f3b4.westeurope-01.azurewebsites.net/generate-text"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
# מודל של בקשת הרשמה
class RegisterUser(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    
@app.get("/generate")
def call_gpt_server():
    try:
        response = requests.post(GPT_SERVER_URL)
        data = response.json()
        return {"response_from_gpt_server": data}
    except Exception as e:
        return {"error": str(e)}


@app.get("/")
def home():
    return {"status": "Server running successfully on Azure!"}
@app.post("/register")
async def register_user(user: RegisterUser):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    user_doc = {
        "fullName": user.fullName,
        "email": user.email,
        "password": hashed_pw.decode('utf-8')
    }

    users_collection.insert_one(user_doc)
    random_text =  call_gpt_server()
	 
    return {"message": f"User {user.fullName} registered successfully!","gpt_response": random_text}
