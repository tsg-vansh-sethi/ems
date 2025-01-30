from models import User,LoginRequest
from fastapi import HTTPException
from db import my_collection
from db import audit_collection
from passlib.context import CryptContext
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
from jose import jwt,JWTError
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import EmailStr
import os
from fastapi import Cookie
#OAuth2PasswordBearer is a FastAPI class that extracts Bearer tokens from the Authorization header.
# when we pass the token url: oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login') login route will return a JSON response like: {"access_token": access_token, "token_type":"bearer"}
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  
passwordHasher = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    """Hash the password using bcrypt."""
    return passwordHasher.hash(password)

load_dotenv(dotenv_path="../.env")
# for jwt token generation
# SECRET_KEY=os.getenv("SECRET_KEY")
# ALGORITHM=os.getenv("ALGORITHM")
SECRET_KEY="ba6f32be396adb3115c3a89f457262d4e70008fd36aff61adf46b33f89112520"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=20

def generateJWTtoken(email,role):
    to_encode={"email":email,"role":role}
    # expire=datetime.now()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)#timedelta for better readability if we dont want to use then have to pass exact time for 20 minutes , 20*60 seconds
    # datatime object is not json serilizable so we convert to timestamps (e.g., UNIX timestamps) are JSON serializable because they are represented as numbers, either integers or floats, which are supported by JSON.
    expire=(datetime.now()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()
    to_encode.update({"expire":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,ALGORITHM)
    return encoded_jwt

def get_current_user(access_token: str = Cookie(None)):  # Extract token from cookies
     #try-except when working with functions or libraries that can throw exceptions you don’t directly control (e.g., jwt.decode or database queries). we dont know how jwt decode works externlly
     print(access_token)
     if not access_token:
        raise HTTPException(status_code=401, detail="Missing token")    
     try:
         payload=jwt.decode(access_token,SECRET_KEY,ALGORITHM)
         exp=payload.get("expire")
         # add a check for expire time
         if datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token expired")
         return payload
     except JWTError:
         raise HTTPException(status_code=401, detail="Invalid token")

def authenticateUser(user:LoginRequest)->bool:
        document=my_collection.find_one({"email":  user.email})
        if not document:
            raise HTTPException(status_code=404,detail="User not found") #user not found
        return passwordHasher.verify(user.password,document["password"])

def getAllUsers():
    # Retrieve all documents in the "users" collection
    # users =my_collection.find()
    #above statement doesnt work for below statement .find() returns a cursor object not list so you cannot do
    # user[_id] this sort of thing in cursor so we covert  to list to get all data at once
    users =list(my_collection.find())
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON serialization
        #is necessary because MongoDB's _id field is an ObjectId type, which is not JSON-serializable. FastAPI (and most web APIs) send and receive data in JSON format, 
        # and the ObjectId type cannot be directly represented in JSON. 
    return users

def ifEmployeeExist(user:User)->bool:
    response=my_collection.find_one({"email":  user.email})
    if response:
        return True
    return False

def addEmployee(user:User):
    userData=user.model_dump()
    userData["password"] = hash_password(userData["password"])  # Hash the password
    response=my_collection.insert_one(userData)
    # return True
    return {"id": str(response.inserted_id)}  # Return the inserted document ID

def deleteEmployee(email):
    response=my_collection.delete_one({"email":email})
    return response

def getUser(email):
    response=my_collection.find_one({"email":email}) # _id is not json serializable
    response["_id"] = str(response["_id"])
    return response

def updateEmployee(email,updates):
    # response=my_collection.update_one({"email":email},{"$set":{"phoneNumber":phonenumber,"address":address}})
    role = "admin"
    # find the employee document related to email to whom we have to make changes
    employee=my_collection.find_one({"email":email})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if role=="admin":
        allowed_fields = {"name", "email","address", "phoneNumber", "department", "role","startingDate"}
    else:
        allowed_fields = {"address", "phoneNumber"}
        #general syntax for dictionary comprehension
        #{key: value for key, value in <source_dictionary>.items() if <condition>}
    filtered_updates = {key: value for key, value in updates.items() if key in allowed_fields}
    # Perform the update
    response = my_collection.update_one({"email": email}, {"$set": filtered_updates})

    audit_entry={
        "updated_by":employee["email"],
        "role":employee["role"],
        "updated_when":datetime.now(),
        "changes":list(filtered_updates.keys())
    }
    audit_collection.insert_one(audit_entry)
    return response
    
