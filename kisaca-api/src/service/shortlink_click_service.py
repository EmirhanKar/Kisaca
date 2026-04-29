from src.database.repository.shortlink_click_repository import ShortlinkClickRepository
from src.models.shortlink_click import ShortlinkClick


class ShortlinkClickService:
    def __init__(self, shortlink_click_repository: ShortlinkClickRepository):
        self.shortlink_click_repository = shortlink_click_repository

    async def create_shortlink_click(self, shortlink_click: ShortlinkClick) -> ShortlinkClick:
        return await self.shortlink_click_repository.create(shortlink_click)
