from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from .shortlink import Shortlink


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    full_name: str | None = Field(default=None)
    email: str = Field(unique=True)
    password: str

    shortlinks: list["Shortlink"] = Relationship(back_populates="user")
