from pydantic import BaseModel, EmailStr, field_validator, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    usuario: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, value:str):
        if len(value) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return value

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True
        
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: str
    

class AlertCreate(BaseModel):
    event_type: str = Field(..., min_length=3)
    alert_type: str
    lat: float
    lng: float


class AlertResponse(BaseModel):
    id: int
    event_type: str
    alert_type: str
    lat: float
    lng: float

    class Config:
        from_attributes = True