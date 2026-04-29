from src.core.exceptions.api_exception import APIException


class UserNotFoundException(APIException):
    status_code = 404
    detail = "User not found."
