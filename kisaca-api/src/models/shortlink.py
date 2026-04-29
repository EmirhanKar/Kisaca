from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from src.core.models.timestamp import TimestampMixin


if TYPE_CHECKING:
    from .shortlink_click import ShortlinkClick
    from .user import User


class Shortlink(TimestampMixin, table=True):
    __tablename__ = "shortlinks"

    id: int | None = Field(default=None, primary_key=True)
    original_url: str
    short_url: str = Field(unique=True)
    is_active: bool = Field(default=True)
    user_id: int | None = Field(foreign_key="user.id", nullable=True, ondelete="CASCADE")

    clicks: list["ShortlinkClick"] = Relationship(back_populates="shortlink")
    user: Optional["User"] = Relationship(back_populates="shortlinks")
