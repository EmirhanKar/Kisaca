from src.core.exceptions.api_exception import APIException


class UnauthenticatedException(APIException):
    status_code = 401
    detail = "User is not authenticated."
