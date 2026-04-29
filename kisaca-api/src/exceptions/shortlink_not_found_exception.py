from src.core.exceptions.api_exception import APIException


class ShortlinkNotFoundException(APIException):
    status_code = 404
    detail = "Shortlink not found"
