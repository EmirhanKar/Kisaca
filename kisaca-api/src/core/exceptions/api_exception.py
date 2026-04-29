from fastapi import HTTPException


class APIException(HTTPException):
    status_code: int
    detail: str

    def __init__(self):
        super().__init__(
            status_code=self.status_code,
            detail=self.detail,
        )
