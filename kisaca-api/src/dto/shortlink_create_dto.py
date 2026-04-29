from pydantic import BaseModel


class ShortlinkCreateDTO(BaseModel):
    target_url: str
