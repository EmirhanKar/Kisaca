from src.core.exceptions.api_exception import APIException


class InvalidCredentialsException(APIException):
    status_code = 401
    detail = "Invalid email or password."
