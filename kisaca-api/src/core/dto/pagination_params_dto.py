from pydantic import BaseModel


class PaginationParamsDTO(BaseModel):
    offset: int = 0
    limit: int = 10
