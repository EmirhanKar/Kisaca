import secrets

from src.database.repository import ShortlinkRepository
from src.exceptions.shortlink_not_found_exception import ShortlinkNotFoundException
from src.models.shortlink import Shortlink
from src.models.shortlink_click import ShortlinkClick
from src.service.shortlink_click_service import ShortlinkClickService
from src.settings import get_settings


settings = get_settings()


class ShortlinkService:
    def __init__(self, shortlink_repository: ShortlinkRepository, shortlink_click_service: ShortlinkClickService):
        self.shortlink_repository = shortlink_repository
        self.shortlink_click_service = shortlink_click_service

    async def generate_shortlink(self) -> str:
        return secrets.token_urlsafe(32)

    async def create_shortlink(self, shortlink: Shortlink) -> Shortlink:
        shortlink.short_url = await self.generate_shortlink()
        return await self.shortlink_repository.create(shortlink)

    async def update_shortlink(self, shortlink: Shortlink) -> Shortlink:
        return await self.shortlink_repository.update(shortlink)

    async def get_shortlink_by_short_url(self, short_url: str) -> Shortlink:
        shortlink = await self.shortlink_repository.get_by_short_url(short_url)
        if not shortlink:
            raise ShortlinkNotFoundException()
        shortlink_click = ShortlinkClick(shortlink_id=shortlink.id)
        await self.shortlink_click_service.create_shortlink_click(shortlink_click)
        return shortlink

    async def get_user_shortlinks(
        self,
        user_id: int,
        limit: int,
        offset: int,
        search: str | None = None,
    ) -> list[Shortlink]:
        return await self.shortlink_repository.get_all_by_user_id(
            user_id=user_id,
            limit=limit,
            offset=offset,
            search=search,
        )

    async def get_shortlink_by_id_and_user_id(self, id: int, user_id: int) -> Shortlink:
        shortlink = await self.shortlink_repository.get_by_id_and_user_id(id=id, user_id=user_id)
        if not shortlink:
            raise ShortlinkNotFoundException()
        return shortlink
