from typing import Optional

from pydantic import BaseModel, EmailStr


class RegisterDTO(BaseModel):
    full_name: Optional[str]
    email: EmailStr
    password: str
