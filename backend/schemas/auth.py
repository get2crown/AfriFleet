# backend/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: str = "logistics_officer"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None