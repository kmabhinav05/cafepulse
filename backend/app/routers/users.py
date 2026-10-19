from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.security import hash_password
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserUpdate

router = APIRouter(prefix="/users", tags=["Users Management"])


@router.get("", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all registered users (Admin only)."""
    return db.query(User).order_by(User.created_at.desc()).all()


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new staff or administrator account (Admin only)."""
    normalized_email = user_in.email.strip().lower()
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise BadRequestException(detail="A user with this email address already exists")

    new_user = User(
        email=normalized_email,
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name.strip(),
        role=user_in.role,
        is_active=user_in.is_active,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update user attributes (Admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    if user_in.email is not None:
        normalized_email = user_in.email.strip().lower()
        conflict = (
            db.query(User)
            .filter(User.email == normalized_email, User.id != user_id)
            .first()
        )
        if conflict:
            raise BadRequestException(detail="Email is already used by another account")
        user.email = normalized_email

    if user_in.full_name is not None:
        user.full_name = user_in.full_name.strip()

    if user_in.role is not None:
        user.role = user_in.role

    if user_in.is_active is not None:
        user.is_active = user_in.is_active

    if user_in.password:
        user.password_hash = hash_password(user_in.password)

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/toggle-active", response_model=UserOut)
def toggle_user_active(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Toggle user active/inactive state (Admin only). Prevents self-deactivation."""
    if admin.id == user_id:
        raise BadRequestException(detail="Cannot deactivate your own administrator account")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user
