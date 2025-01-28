from fastapi import APIRouter, HTTPException,Depends
from models import User,LoginRequest,Token_Payload
from core import authenticateUser,getAllUsers,addEmployee,ifEmployeeExist,updateEmployee,deleteEmployee,generateJWTtoken,get_current_user,getUser
from pydantic import EmailStr
from db import my_collection
# router =APIRouter()
# as here all routes are of User so no need to explicitly mention, define in APIRouter()
router =APIRouter(
    tags=["User"],
    prefix="",
)


@router.post("/login")
def login(user:LoginRequest):
    
    is_authenticated=authenticateUser(user)
    if not is_authenticated:
        raise HTTPException(status_code=401, detail="Invalid Password!")
    # now both email and password working now we have to issue jwt token
    #we dont have to manually go and create these tokens , python has packages for it-pythonjose
    fullDocument=my_collection.find_one({"email": user.email})
    user_dict=user.model_dump()
    access_token=generateJWTtoken(user_dict["email"],fullDocument["role"])
    return {"access_token":access_token,"token-type":"bearer"} #The Bearer keyword means "the person holding this token is authorized."

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