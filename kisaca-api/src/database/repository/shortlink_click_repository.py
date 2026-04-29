from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.shortlink_click import ShortlinkClick


class ShortlinkClickRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, shortlink_click: ShortlinkClick) -> ShortlinkClick:
        self.session.add(shortlink_click)
        await self.session.commit()
        await self.session.refresh(shortlink_click)
        return shortlink_click
