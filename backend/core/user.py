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
import os,json
from fastapi import Cookie
from db import redis_client
#OAuth2PasswordBearer is a FastAPI class that extracts Bearer tokens from the Authorization header.
# when we pass the token url: oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login') login route will return a JSON response like: {"access_token": access_token, "token_type":"bearer"}
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  
passwordHasher = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    """Hash the password using bcrypt."""
    return passwordHasher.hash(password)

load_dotenv()
# for jwt token generation
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=20

def generateJWTtoken(email,role,name):
    to_encode={"email":email,"role":role,"name":name}
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
        # it does the following:
        # Verifies the signature (checks if the token was signed with the correct secret key).
        # Checks the algorithm (ensures the correct signing method was used).
        # Validates claims (like exp, iat, nbf if present).
         exp=payload.get("expire")
         # add a check for expire time
         if datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token expired")
         return payload
     except JWTError:
         raise HTTPException(status_code=401, detail="Invalid token")

cache_key="all_users"
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

def ifEmployeeExist(user: User) -> bool:
    # ✅ First, check Redis cache
    if redis_client.hexists(cache_key, user.email):
        return True  # Employee is already cached

    # ✅ If not found in Redis, check MongoDB
    response = my_collection.find_one({"email": user.email})
    
    return bool(response)  # Returns True if user exists, False otherwise

def addEmployee(user:User,currentUser):
    userData=user.model_dump()
    userData["password"] = hash_password(userData["password"])  # Hash the password
    response=my_collection.insert_one(userData)
    # ✅ Store new user in Redis cache
    userData["_id"]=str(response.inserted_id)
    audit_entry={
        "added_by":currentUser["email"],
        "role":currentUser["role"],
        "added_whom":userData,
        "added_when":datetime.now(),
    }
    redis_client.hset(cache_key, user.email, json.dumps(userData))
    audit_collection.insert_one(audit_entry)
    return {"id": str(response.inserted_id)}  # Return the inserted document ID 



def deleteEmployee(email,currentUser):
    if redis_client.hexists(cache_key, email):
        redis_client.hdel(cache_key, email)  # ✅ O(1) operation
    response=my_collection.delete_one({"email":email})
    audit_entry={
        "deleted_by":currentUser["email"],
        "role":currentUser["role"],
        "deleted_whom":email,
        "deleted_when":datetime.now(),
    }
    audit_collection.insert_one(audit_entry)
    return response

def getUser(email):
    cached_user = redis_client.hget(cache_key, email)  # ✅ Fetches only the required user
    if cached_user:
        print("returning this user from redis")
        return json.loads(cached_user)

    response=my_collection.find_one({"email":email}) # _id is not json serializable
    response["_id"] = str(response["_id"])
    return response

def updateEmployee(email,updates,current_user):
    # response=my_collection.update_one({"email":email},{"$set":{"phoneNumber":phonenumber,"address":address}})
    role = current_user["role"]
    # find the employee document related to email to whom we have to make changes
    employee=my_collection.find_one({"email":email})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if role=="admin":
        allowed_fields = {"name","address", "phoneNumber", "department", "role","startingDate"}
    else:
        allowed_fields = {"name","address", "phoneNumber"}
        #general syntax for dictionary comprehension
        #{key: value for key, value in <source_dictionary>.items() if <condition>}
    filtered_updates = {key: value for key, value in updates.items() if key in allowed_fields}
    changes = {
        key: {"old": employee.get(key, None), "new": value}
        for key, value in filtered_updates.items()
        if employee.get(key) != value #If the old and new values are different, it means the field was updated, so we keep it.
        }
    # Perform the update
    response = my_collection.update_one({"email": email}, {"$set": filtered_updates})
    updatedEmployee=my_collection.find_one({"email":email})
    updatedEmployee["_id"]=str(updatedEmployee["_id"])
    redis_client.hset(cache_key, email, json.dumps(updatedEmployee))
    audit_entry={
        "updated_by":current_user["email"],
        "role":current_user["role"],
        "updated_whom":employee["email"],
        "updated_when":datetime.now(), 
        "changes":changes
    }
    audit_collection.insert_one(audit_entry)
    return response
    
