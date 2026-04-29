from pydantic import BaseModel


class TokenDataDTO(BaseModel):
    id: int
    full_name: str
    email: str
