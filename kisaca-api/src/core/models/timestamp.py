from datetime import date

from sqlmodel import Field, SQLModel


class TimestampMixin(SQLModel):
    created_at: date = Field(default_factory=date.today)
    updated_at: date = Field(default_factory=date.today)
