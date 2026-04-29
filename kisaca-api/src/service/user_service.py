from src.core.security.jwt_helper import create_access_token
from src.core.security.password_hasher import generate_password_hash, verify_password
from src.database.repository.user_repository import UserRepository
from src.dto.token_data_dto import TokenDataDTO
from src.exceptions.invalid_credentials_exception import InvalidCredentialsException
from src.exceptions.user_not_found_exception import UserNotFoundException
from src.exceptions.user_with_email_exists_exception import UserWithEmailExistsException
from src.models.user import User


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def create(self, user: User) -> User:
        existing_user = await self.user_repository.get_user_by_email(email=user.email)
        if existing_user:
            raise UserWithEmailExistsException()
        user.password = generate_password_hash(user.password)
        return await self.user_repository.create(user)

    async def login(self, email: str, password: str) -> tuple[str, User]:
        user = await self.user_repository.get_user_by_email(email=email)
        if not user:
            raise UserNotFoundException()
        password_matching = verify_password(password, user.password)
        if not password_matching:
            raise InvalidCredentialsException()
        token_data = TokenDataDTO(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
        )
        return (
            create_access_token(
                data={
                    "sub": user.email,
                    "data": token_data.model_dump(),
                },
            ),
            user,
        )
