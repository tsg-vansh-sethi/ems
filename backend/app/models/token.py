from pydantic import BaseModel,EmailStr
from typing import Optional

class Token(BaseModel):
    access_token:str
    type:str

class Token_Payload(BaseModel):
    email:EmailStr
    role:str
    id:Optional[str]=None