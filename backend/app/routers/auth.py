from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import LoginRequest, UserOut
from app.schemas.token import Token, RefreshTokenRequest
from app.services.auth_service import authenticate_user, create_user_tokens, refresh_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email/password and return JWT tokens."""
    user = authenticate_user(db, email=request.email, password=request.password)
    return create_user_tokens(user)


@router.post("/refresh", response_model=Token)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Issue a new access token using a valid refresh token."""
    return refresh_access_token(db, refresh_token=request.refresh_token)


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Return profile details of the currently authenticated user."""
    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: User = Depends(get_current_user)):
    """Logout endpoint acknowledging token invalidation."""
    return {"message": "Successfully logged out", "user_id": current_user.id}
