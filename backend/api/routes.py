from fastapi import APIRouter, HTTPException,Depends,Response,Query
from models import User,LoginRequest
from core import authenticateUser,getAllUsers,addEmployee,ifEmployeeExist,updateEmployee,deleteEmployee,generateJWTtoken,get_current_user,getUser,ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import EmailStr
from db import my_collection ,redis_client,audit_collection   
from faker import Faker
from fastapi.responses import JSONResponse
from datetime import datetime
from pymongo import ASCENDING,DESCENDING
import json

# router =APIRouter()
# as here all routes are of User so no need to explicitly mention, define in APIRouter()
router =APIRouter(
    tags=["User"],
    prefix="",
)
fake = Faker()
cache_key = "all_users"
@router.post("/login")
def login(user:LoginRequest, response: Response):
    
    is_authenticated=authenticateUser(user)
    if not is_authenticated:
        raise HTTPException(status_code=401, detail="Invalid Password!")
    # now both email and password working now we have to issue jwt token
    #we dont have to manually go and create these tokens , python has packages for it-pythonjose
    fullDocument=my_collection.find_one({"email": user.email})
    access_token = generateJWTtoken(fullDocument["email"], fullDocument["role"],fullDocument["name"])
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevent JavaScript access (XSS protection)
        secure=True,  # Ensures HTTPS-only transmission (important for production)
         samesite="None",  # Helps prevent CSRF attacks
         path="/",
        max_age=60 * ACCESS_TOKEN_EXPIRE_MINUTES  # Cookie expiry (matches token expiry)
    )
    return response

@router.get("/current-user-details")
def get_user_data(current_user: dict = Depends(get_current_user)):
    return current_user  # Return user email and role

@router.post("/logout")
def logout(response: Response,current_user:dict=Depends(get_current_user)):
    redis_client.delete(cache_key)
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("access_token")  # Clears the cookie
    return response

@router.get("/getAllUsers")
def getUsers(current_user:dict=Depends(get_current_user)): #Depends(get_current_user):Only users with a valid JWT token can access it.
    user_email = current_user.get("email")  # Extract email from current_user
   # cache approach will be
    cached_users = redis_client.hgetall(cache_key)  # ✅ Efficient: O(n) for fetching all . we get a dictionary of objects
    if cached_users:
        print("Returning users from Redis cache.")
        return [json.loads(user) for user in cached_users.values()] # redis jo return krta hai Python dictionary, but all values are still in string (JSON) format:
    
    # Redis hashes (HSET, HGETALL) do not maintain the order of keys as they are stored in an unordered hash table internally. When retrieving data using HGETALL, Redis returns the data in arbitrary order.
    #Hash tables are inherently unordered because they store data based on hashing algorithms.
    response=getAllUsers()
    #now
    for user in response:
        redis_client.hset(cache_key, user["email"], json.dumps(user))  # ✅ O(1) for each user HSET modifies/adds only one field (the employee’s email) inside the hash.
        redis_client.expire(cache_key,3600)
    return response

@router.post("/addemployee")
def newEmployee(user:User,current_user:dict=Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can add employees")
    if(ifEmployeeExist(user)):
        raise HTTPException(status_code=409,detail="User already exits")
    response=addEmployee(user,current_user)
    if response:
        return {"message": "Employee added successfully"}
    return HTTPException(status_code=400, detail="Somthing went wrong/Bad request")

@router.get("/user/{email}")
def getUserDetails(email:EmailStr,current_user:dict=Depends(get_current_user)):
    document=getUser(email)
    if not document:
        raise HTTPException(status_code=409, detail="Employee not found")
    return document


@router.put("/dashboard/{email}")
def editEmployee(email: EmailStr, updates:dict,current_user:dict=Depends(get_current_user)):
    response = updateEmployee(email, updates,current_user)
    # Check if the employee exists
    if response.matched_count == 0:
        raise HTTPException(status_code=409, detail="Employee not found")
    
    # Check if changes were actually made
    if response.modified_count == 0:
        return {"message": "No changes made."}  
    
    return {"message": "Employee updated successfully"}


@router.delete("/dashboard/{email}")
def removeEmployee(email: EmailStr,current_user:dict=Depends(get_current_user)):
    response = deleteEmployee(email,current_user)
    print(current_user)
    # Check if any document was deleted
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete employees")
    if response.deleted_count == 0:
        raise HTTPException(status_code=409, detail="Employee not found")
    return {"message": "Employee deleted successfully"}


# using fake data
@router.get("/get-fake-users")
def get_fake_users(start: int = 0, limit: int = 1000,current_user:dict=Depends(get_current_user)):
    email=current_user.get("email")
    users = [
        {
             "name": fake.name(),
            "email": fake.email(),
            "password":fake.password(),
            "phoneNumber": fake.phone_number(),
            "address": fake.address(),
            "department": fake.company(),  # Ensure correct field name
            "role": "employee",
            "startingDate": datetime.now().isoformat()  # Ensure correct field name
        }
        for i in range(start, start + limit)
    ]
    my_collection.insert_many(users)
    users_cursor = my_collection.find()
    users = [{**user, "_id": str(user["_id"])} for user in users_cursor]  # Convert ObjectId to string
    for user in users:
        redis_client.hset(cache_key, user["email"], json.dumps(user))
    audit_entry={
        "added_by":current_user["email"],
        "role":current_user["role"],
        "added":"Added fake users",
        "added_when":datetime.now(),
    }
    audit_collection.insert_one(audit_entry)
    return {"total_users": len(users), "users": users}

@router.get("/filter-users")
def filter_users(filtertype: str, text: str,current_user:dict=Depends(get_current_user)):
    query = {filtertype: {"$regex": text, "$options": "i"}}  # Case-insensitive search
    users_cursor = my_collection.find(query)
    users = []
    for user in users_cursor:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        users.append(user) # Convert ObjectId to string
    return {"total_users": len(users), "users": users}

@router.delete("/delete-users")
def delete_users(current_user:dict=Depends(get_current_user)):
     user_email = current_user.get("email")  # Extract email from current_user
         
     if not user_email:
        return {"error": "User email not found in current session"}
    #  cached_users=redis_client.get(cache_key)
    #  if cached_users:
    #      cached_users.
    # Delete all users except the current user
     redis_client.delete(cache_key)
     result = my_collection.delete_many({"email": {"$ne": user_email}})  # `$ne` means "not equal"
     audit_entry={
        "deleted_by":current_user["email"],
        "role":current_user["role"],
        "deleted":"Deleted all fake users",
        "deleted_when":datetime.now(),
    }
     audit_collection.insert_one(audit_entry)
     return {
        "message": "Users deleted successfully (except current user)",
        "deleted_count": result.deleted_count}

@router.get("/sorted-users")
def get_sorted_users(
    sort_by: str = Query("name", description="Column to sort by"),
    order: str = Query("asc", description="Sort order: 'asc' or 'desc'"),
    current_user:dict=Depends(get_current_user)
):
    # Determine MongoDB sort order
    query = my_collection.find()

    if order and order.lower() in ["asc", "desc"]:
        sort_order = ASCENDING if order.lower() == "asc" else DESCENDING
        query = query.sort(sort_by, sort_order).collation({"locale": "en", "strength": 2})
    

   # Collation in MongoDB is a way to specify language-specific rules for sorting and string comparisons
#    By default, MongoDB sorts strings in a case-sensitive way. This means:
# "Alice" comes before "bob" (uppercase is sorted before lowercase).
# "apple" is after "Banana", which can be confusing.
# Using collation, we can ignore case and sort strings in a way that feels natural.
# "strength": 1	Ignores accents + case (e.g., "café" == "CAFE").
# "strength": 2	Ignores case but considers accents (e.g., "café" != "CAFE").
# db["users"].createIndex(
#   { address: 1 },
#   { collation: { locale: "en", strength: 2 } }
# )
    # if order == "asc":
    #     users_cursor = faker_collection.find().sort(sort_by, ASCENDING).collation({"locale": "en", "strength": 1})
    # elif order == "desc":
    #     users_cursor = faker_collection.find().sort(sort_by, DESCENDING).collation({"locale": "en", "strength": 1})
    # else:  #
    #     users_cursor = faker_collection.find()
    # Convert MongoDB cursor to a list and serialize ObjectId
    users = []
    for user in query:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        users.append(user)

    return {"total_users": len(users), "users": users}