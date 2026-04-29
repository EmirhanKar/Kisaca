from pydantic import BaseModel


class ShortlinkUpdateDTO(BaseModel):
    original_url: str | None = None
    short_url: str | None = None
