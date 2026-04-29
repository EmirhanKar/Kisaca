from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel import MetaData, SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from src.settings import get_settings


settings = get_settings()
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}
metadata = MetaData(naming_convention=naming_convention)
SQLModel.metadata = metadata

engine = create_async_engine(
    settings.DB_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,
)

AsyncSessionMaker = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
    class_=AsyncSession,
)
