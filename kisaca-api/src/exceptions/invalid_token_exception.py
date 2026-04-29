from src.core.exceptions.api_exception import APIException


class InvalidTokenException(APIException):
    status_code = 401
    detail = "Invalid or expired token."
