from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import CredentialsException, PermissionDeniedException
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Dependency to retrieve and authenticate the current user from Bearer token."""
    if not token:
        raise CredentialsException(detail="Authentication token missing")

    payload = decode_token(token)
    if not payload:
        raise CredentialsException(detail="Invalid or expired token")

    token_type = payload.get("type")
    if token_type != "access":
        raise CredentialsException(detail="Invalid token type, access token required")

    user_id: str = payload.get("sub")
    if not user_id:
        raise CredentialsException(detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise CredentialsException(detail="User not found")

    if not user.is_active:
        raise PermissionDeniedException(detail="User account is deactivated")

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency restricting route access to administrator role only."""
    if current_user.role != "admin":
        raise PermissionDeniedException(detail="Administrator access required")
    return current_user
