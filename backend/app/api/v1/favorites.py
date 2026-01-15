from fastapi import APIRouter
from fastapi import HTTPException,Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.dependencies import get_db
from app.services.favorites_service import add_save, get_user_favorites
from app.models.favorite import Favorite
router = APIRouter(prefix="/api/v1/favorite",tags=["favorite"])


@router.post("/")
def add_save(favorite:Favorite,db:Session = Depends(get_db)):

    try:
        restaurant = add_save(favorite,db)
        return {f"Added {restaurant.name} to favorites",restaurant}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")

@router.get("/{user_id}")
def get_favorites(user_id:str,db:Session = Depends(get_db)):
    try:
        restaurants = get_user_favorites(user_id,db)

        return {"favorites":restaurants}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail=f"Database error {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")