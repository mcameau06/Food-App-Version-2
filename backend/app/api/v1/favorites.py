from fastapi import APIRouter
from fastapi import HTTPException,Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.dependencies import get_db
from app.services.favorites_service import add_save, get_user_favorites,remove_favorite
from app.models.favorite import Favorite
router = APIRouter(prefix="/api/v1/favorite",tags=["favorite"])


@router.post("/")
def save_restaurant(favorite:Favorite,db:Session = Depends(get_db)):

    try:
        restaurant = add_save(favorite,db)
        return {f"Added {restaurant.name} to favorites":restaurant}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")

@router.get("/{user_id}")
def get_favorited_restaurants(user_id:str,db:Session = Depends(get_db)):
    try:
        restaurants = get_user_favorites(user_id,db)

        return {"favorites":restaurants}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")

@router.delete("/{user_id}/{place_id}")
def remove_favorited_restaurant(user_id: str, restaurant_id: str, db: Session = Depends(get_db)):
    try:
        remove_favorite(user_id,restaurant_id,db)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")
        
