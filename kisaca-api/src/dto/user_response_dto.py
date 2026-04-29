from pydantic import BaseModel


class UserResponseDTO(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True
