from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from src.core.models.timestamp import TimestampMixin


if TYPE_CHECKING:
    from .shortlink import Shortlink


class ShortlinkClick(TimestampMixin, table=True):
    __tablename__ = "shortlink_clicks"

    id: int | None = Field(default=None, primary_key=True)
    shortlink_id: int = Field(foreign_key="shortlinks.id")

    shortlink: "Shortlink" = Relationship(back_populates="clicks")
