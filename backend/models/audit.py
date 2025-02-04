from pydantic import BaseModel,EmailStr
from datetime import datetime

class Audit(BaseModel):
    updated_by:EmailStr
    role:str
    updated_when:datetime
    changes:dict

