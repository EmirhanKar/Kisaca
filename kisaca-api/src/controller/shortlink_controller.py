from typing import Annotated

from fastapi import Body, Depends, Query
from fastapi.routing import APIRouter

from src.core.dependency import get_pagination_params
from src.core.dto.pagination_params_dto import PaginationParamsDTO
from src.dependency import get_current_user, get_shortlink_service
from src.dto.shortlink_create_dto import ShortlinkCreateDTO
from src.dto.shortlink_response_dto import ShortlinkResponseDTO
from src.dto.shortlink_update_dto import ShortlinkUpdateDTO
from src.dto.token_data_dto import TokenDataDTO
from src.exceptions.unauthenticated_exception import UnauthenticatedException
from src.models.shortlink import Shortlink
from src.service.shortlink_service import ShortlinkService


shortlink_router = APIRouter()


# contract based


@shortlink_router.post("", response_model=ShortlinkResponseDTO)
async def create_shortlink(
    request: Annotated[ShortlinkCreateDTO, Body()],
    token_data: Annotated[TokenDataDTO | None, Depends(get_current_user)],
    service: ShortlinkService = Depends(get_shortlink_service),
) -> ShortlinkResponseDTO:
    user_id = None
    if token_data:
        user_id = token_data.id
    shortlink = Shortlink(original_url=request.target_url, user_id=user_id)
    await service.create_shortlink(shortlink)
    return shortlink


@shortlink_router.get("")
async def get_all_shortlinks(
    pagination_params: Annotated[PaginationParamsDTO, Depends(get_pagination_params)],
    token_data: Annotated[TokenDataDTO | None, Depends(get_current_user)],
    service: ShortlinkService = Depends(get_shortlink_service),
    search: Annotated[str | None, Query()] = None,
) -> list[ShortlinkResponseDTO]:
    if not token_data:
        raise UnauthenticatedException()

    user_id = token_data.id
    shortlinks = await service.get_user_shortlinks(
        user_id=user_id,
        limit=pagination_params.limit,
        offset=pagination_params.offset,
        search=search,
    )
    results = []
    for shortlink, click_count in shortlinks:
        shortlink_dto = ShortlinkResponseDTO(
            id=shortlink.id,
            original_url=shortlink.original_url,
            short_url=shortlink.short_url,
            click_count=click_count,
            created_at=shortlink.created_at,
        )
        results.append(shortlink_dto)
    return results


@shortlink_router.get("/short-url/{short_url}", response_model=ShortlinkResponseDTO)
async def get_shortlink(
    short_url: str,
    service: ShortlinkService = Depends(get_shortlink_service),
) -> ShortlinkResponseDTO:
    shortlink = await service.get_shortlink_by_short_url(short_url)
    return shortlink


@shortlink_router.get("/by-id/{id}", response_model=ShortlinkResponseDTO)
async def get_shortlink_by_id(
    id: int,
    token_data: Annotated[TokenDataDTO | None, Depends(get_current_user)],
    service: ShortlinkService = Depends(get_shortlink_service),
) -> ShortlinkResponseDTO:
    if not token_data:
        raise UnauthenticatedException()

    shortlink = await service.get_shortlink_by_id_and_user_id(id=id, user_id=token_data.id)
    return shortlink


@shortlink_router.patch("/by-id/{id}", response_model=ShortlinkResponseDTO)
async def update_shortlink(
    id: int,
    request: Annotated[ShortlinkUpdateDTO, Body()],
    token_data: Annotated[TokenDataDTO | None, Depends(get_current_user)],
    service: ShortlinkService = Depends(get_shortlink_service),
) -> ShortlinkResponseDTO:
    if not token_data:
        raise UnauthenticatedException()

    shortlink = await service.get_shortlink_by_id_and_user_id(id=id, user_id=token_data.id)
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(shortlink, key, value)
    shortlink = await service.update_shortlink(shortlink)
    return shortlink


@shortlink_router.patch("/by-id/{id}/deactivate", response_model=ShortlinkResponseDTO)
async def deactivate_shortlink(
    id: int,
    token_data: Annotated[TokenDataDTO | None, Depends(get_current_user)],
    service: ShortlinkService = Depends(get_shortlink_service),
) -> ShortlinkResponseDTO:
    if not token_data:
        raise UnauthenticatedException()

    shortlink = await service.get_shortlink_by_id_and_user_id(id=id, user_id=token_data.id)
    shortlink.is_active = False
    shortlink = await service.update_shortlink(shortlink)
    return shortlink
