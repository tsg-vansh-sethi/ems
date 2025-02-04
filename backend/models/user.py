from pydantic import BaseModel,EmailStr
from datetime import datetime

class User(BaseModel):
    email:EmailStr
    password: str
    name:str
    address:str
    phoneNumber:int
    role:str
    department:str
    startingDate:str
        
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

#response model is something say we dont want to diplay all fields , we want to hide sensitive information,
# so in this condition we make use responseModel

# class UserResponse(BaseModel):
#     email:EmailStr
#     name:str
#     address:str
#     phoneNumber:int
#     department:str
#     startingDate:datetime
#he orm_mode configuration in Pydantic models is used to allow the model to work seamlessly with non-dictionary objects, such as ORM objects (like SQLAlchemy models) or any other objects that don’t naturally return dictionaries.