from pydantic import BaseModel

from src.dto.user_response_dto import UserResponseDTO


class LoginResponseDTO(BaseModel):
    access_token: str
    user: UserResponseDTO
