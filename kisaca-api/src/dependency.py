from typing import AsyncGenerator

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel.ext.asyncio.session import AsyncSession

from src.database.connection import AsyncSessionMaker
from src.database.repository import ShortlinkClickRepository, ShortlinkRepository, UserRepository
from src.dto.token_data_dto import TokenDataDTO
from src.service import ShortlinkClickService, ShortlinkService, UserService
from src.settings import get_settings


settings = get_settings()


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionMaker() as session:
        yield session


async def get_user_repository(session: AsyncSession = Depends(get_session)) -> AsyncGenerator[UserRepository, None]:
    yield UserRepository(session=session)


async def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> AsyncGenerator[UserService, None]:
    yield UserService(user_repository=user_repository)


async def get_shortlink_click_repository(
    session: AsyncSession = Depends(get_session),
) -> AsyncGenerator[ShortlinkClickRepository, None]:
    yield ShortlinkClickRepository(session=session)


async def get_shortlink_click_service(
    shortlink_click_repository: ShortlinkClickRepository = Depends(get_shortlink_click_repository),
) -> AsyncGenerator[ShortlinkClickService, None]:
    yield ShortlinkClickService(shortlink_click_repository=shortlink_click_repository)


async def get_shortlink_repository(
    session: AsyncSession = Depends(get_session),
) -> AsyncGenerator[ShortlinkRepository, None]:
    yield ShortlinkRepository(session=session)


async def get_shortlink_service(
    shortlink_repository: ShortlinkRepository = Depends(get_shortlink_repository),
    shortlink_click_service: ShortlinkClickService = Depends(get_shortlink_click_service),
) -> AsyncGenerator[ShortlinkService, None]:
    yield ShortlinkService(shortlink_repository=shortlink_repository, shortlink_click_service=shortlink_click_service)


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> TokenDataDTO | None:
    if credentials is None:
        return None
    token = credentials.credentials
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    return TokenDataDTO(**payload["data"])
