from typing import Annotated

from fastapi import Query

from src.core.dto.pagination_params_dto import PaginationParamsDTO


async def get_pagination_params(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
) -> PaginationParamsDTO:
    offset = (page - 1) * limit
    pagination_params = PaginationParamsDTO(offset=offset, limit=limit)
    return pagination_params
