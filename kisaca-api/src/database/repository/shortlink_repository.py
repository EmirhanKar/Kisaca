from datetime import date

from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.shortlink import Shortlink
from src.models.shortlink_click import ShortlinkClick


class ShortlinkRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, shortlink: Shortlink) -> Shortlink:
        self.session.add(shortlink)
        await self.session.commit()
        await self.session.refresh(shortlink)
        return shortlink

    async def update(self, shortlink: Shortlink) -> Shortlink:
        shortlink.updated_at = date.today()
        self.session.add(shortlink)
        await self.session.commit()
        await self.session.refresh(shortlink)
        return shortlink

    async def get_by_short_url(self, short_url: str) -> Shortlink:
        statement = select(Shortlink).where(
            Shortlink.short_url == short_url,
            Shortlink.is_active == True,
        )
        query = await self.session.exec(statement)
        return query.first()

    async def get_by_id_and_user_id(self, id: int, user_id: int) -> Shortlink:
        statement = select(Shortlink).where(
            Shortlink.id == id,
            Shortlink.user_id == user_id,
            Shortlink.is_active == True,
        )
        query = await self.session.exec(statement)
        return query.first()

    async def get_all_by_user_id(
        self,
        user_id: int,
        limit: int,
        offset: int,
        search: str | None = None,
    ) -> list[tuple[Shortlink, int]]:
        # SELECT * FROM shortlink WHERE user_id = :user_id LIMIT :limit OFFSET :offset
        # SELECT * FROM shortlink WHERE user_id = :user_id AND original_url LIKE :search LIMIT :limit OFFSET :offset
        statement = (
            select(Shortlink, func.count(ShortlinkClick.id).label("click_count"))
            .join(ShortlinkClick, ShortlinkClick.shortlink_id == Shortlink.id, isouter=True)
            .where(
                Shortlink.user_id == user_id,
                Shortlink.is_active == True,
            )
            .group_by(Shortlink.id)
        )
        if search:
            statement = statement.where(Shortlink.original_url.ilike(f"%{search}%"))
        statement = statement.limit(limit).offset(offset)
        query = await self.session.exec(statement)
        return query.all()
