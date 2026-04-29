from src.core.exceptions.api_exception import APIException


class UserWithEmailExistsException(APIException):
    status_code = 400
    detail = "User with this email already exists."
