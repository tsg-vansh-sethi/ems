from fastapi import APIRouter, HTTPException,Depends,Response
from models import User,LoginRequest
from jose import jwt
from core import authenticateUser,getAllUsers,addEmployee,ifEmployeeExist,updateEmployee,deleteEmployee,generateJWTtoken,get_current_user,getUser,ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import EmailStr
from db import my_collection
from fastapi.responses import JSONResponse
# router =APIRouter()
# as here all routes are of User so no need to explicitly mention, define in APIRouter()
router =APIRouter(
    tags=["User"],
    prefix="",
)


@router.post("/login")
def login(user:LoginRequest, response: Response):
    
    is_authenticated=authenticateUser(user)
    if not is_authenticated:
        raise HTTPException(status_code=401, detail="Invalid Password!")
    # now both email and password working now we have to issue jwt token
    #we dont have to manually go and create these tokens , python has packages for it-pythonjose
    fullDocument=my_collection.find_one({"email": user.email})
    access_token = generateJWTtoken(fullDocument["email"], fullDocument["role"])
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevent JavaScript access (XSS protection)
        secure=True,  # Ensures HTTPS-only transmission (important for production)
         samesite="None",  # Helps prevent CSRF attacks
        max_age=60 * ACCESS_TOKEN_EXPIRE_MINUTES  # Cookie expiry (matches token expiry)
    )
    return response

@router.get("/me")
def get_user_data(current_user: dict = Depends(get_current_user)):
    return current_user  # Return user email and role
@router.post("/logout")
def logout(response: Response):
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("access_token")  # Clears the cookie
    return response

@router.get("/getAllUsers")
def getUsers(current_user:dict=Depends(get_current_user)): #Depends(get_current_user):Only users with a valid JWT token can access it.
    response=getAllUsers()
    return response

@router.post("/addemployee")
def newEmployee(user:User):
    if(ifEmployeeExist(user)):
        raise HTTPException(status_code=409,detail="User already exits")
    response=addEmployee(user)
    if response:
        return {"message": "Employee added successfully", "employee": response}
    return HTTPException(status_code=400, detail="Somthing went wrong/Bad request")

@router.get("/user/{email}")
def getUserDetails(email:EmailStr,current_user:dict=Depends(get_current_user)):
    document=getUser(email)
    if not document:
        raise HTTPException(status_code=409, detail="Employee not found")
    return document


@router.put("/dasboard/{email}")
def editEmployee(email: EmailStr, updates:dict):
    response = updateEmployee(email, updates)
    
    # Check if the employee exists
    if response.matched_count == 0:
        raise HTTPException(status_code=409, detail="Employee not found")
    
    # Check if changes were actually made
    if response.modified_count == 0:
        return {"message": "No changes made. Data is already up-to-date."}
    
    return {"message": "Employee updated successfully"}


@router.delete("/dashboard/{email}")
def removeEmployee(email: EmailStr,current_user:dict=Depends(get_current_user)):
    response = deleteEmployee(email)
    # Check if any document was deleted
    if response.deleted_count == 0:
        raise HTTPException(status_code=409, detail="Employee not found")
    return {"message": "Employee deleted successfully"}