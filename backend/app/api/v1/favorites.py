from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.security import get_current_user_id
from app.dependencies import get_db
from app.services.favorites_service import add_save, get_user_favorites, remove_favorite
from app.models.favorite import Favorite

router = APIRouter(prefix="/api/v1/favorite", tags=["favorite"])


@router.post("/")
def save_restaurant(
    favorite: Favorite,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """
    Save a restaurant to the authenticated user's favorites.
    The user id is taken from the Supabase JWT, not from the request body.
    """
    try:
        # Ensure we always use the user id from the token
        favorite.user_id = user_id
        restaurant = add_save(favorite, db)
        return {f"Added {restaurant.name} to favorites": restaurant}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")


@router.get("/")
def get_favorited_restaurants(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """
    Get all favorites for the authenticated user.
    """
    try:
        return get_user_favorites(user_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")


@router.delete("/{place_id}")
def remove_favorited_restaurant(
    place_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """
    Remove a restaurant from the authenticated user's favorites.
    """
    try:
        remove_favorite(user_id, place_id, db)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")
        
