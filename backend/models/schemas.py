from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
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