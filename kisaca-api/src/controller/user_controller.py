from typing import Annotated

from fastapi import APIRouter, Body, Depends

from src.dependency import get_current_user, get_user_service
from src.dto.login_dto import LoginDTO
from src.dto.login_response_dto import LoginResponseDTO
from src.dto.register_dto import RegisterDTO
from src.dto.token_data_dto import TokenDataDTO
from src.exceptions.invalid_token_exception import InvalidTokenException
from src.models.user import User
from src.service.user_service import UserService
from src.settings import get_settings


user_router = APIRouter()
settings = get_settings()


@user_router.post("/register")
async def create_user(
    user: Annotated[RegisterDTO, Body()],
    service: UserService = Depends(get_user_service),
):
    try:
        user = User(**user.model_dump())
        response = await service.create(user)
    except:
        return {"error": "User with this email already exists."}
    return response


@user_router.post("/login")
async def login_user(
    user: Annotated[LoginDTO, Body()],
    service: UserService = Depends(get_user_service),
) -> LoginResponseDTO:
    access_token, user = await service.login(user.email, user.password)
    return LoginResponseDTO(access_token=access_token, user=user)


@user_router.get("/me")
async def auth_me(token_data: TokenDataDTO | None = Depends(get_current_user)) -> TokenDataDTO:
    if not token_data:
        raise InvalidTokenException()
    return token_data
