from datetime import date

from pydantic import BaseModel


class ShortlinkResponseDTO(BaseModel):
    id: int
    original_url: str
    short_url: str
    click_count: int
    created_at: date
