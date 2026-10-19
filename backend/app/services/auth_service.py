from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.token import Token
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.exceptions import CredentialsException


def authenticate_user(db: Session, email: str, password: str) -> User:
    """Validate credentials and return User instance or raise exception."""
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user:
        raise CredentialsException(detail="Incorrect email or password")
    if not verify_password(password, user.password_hash):
        raise CredentialsException(detail="Incorrect email or password")
    if not user.is_active:
        raise CredentialsException(detail="Account is currently inactive")
    return user


def create_user_tokens(user: User) -> Token:
    """Generate access and refresh tokens for authenticated user."""
    access_token = create_access_token(subject=user.id, role=user.role)
    refresh_token = create_refresh_token(subject=user.id)
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
    )


def refresh_access_token(db: Session, refresh_token: str) -> Token:
    """Validate refresh token and issue a new token pair."""
    payload = decode_token(refresh_token)
    if not payload:
        raise CredentialsException(detail="Invalid or expired refresh token")

    if payload.get("type") != "refresh":
        raise CredentialsException(detail="Invalid token type, refresh token expected")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise CredentialsException(detail="User inactive or no longer exists")

    return create_user_tokens(user)
