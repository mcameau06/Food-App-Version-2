from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List
from app.database.schemas import Restaurant,User,Favorite 
from app.models.favorite import Favorite as FavoriteModel



def get_or_create_user(user_id:str,db:Session) -> User:
    stmt = select(User).where(User.id == user_id)
    db_user = db.execute(stmt).scalars().first()
    if not db_user:
        db_user = User(id=user_id)
        db.add(db_user)
        db.flush()
    return db_user

def get_or_create_restaurant(favorite_restaurant:Restaurant,db:Session) -> Restaurant:
    stmt_2 = select(Restaurant).where(Restaurant.google_place_id == favorite_restaurant.place_id)
    db_restaurant = db.execute(stmt_2).scalars().first()
    if not db_restaurant:
        db_restaurant = Restaurant(
            google_place_id = favorite_restaurant.place_id,
            name = favorite_restaurant.place_name,
            latitude = favorite_restaurant.lat,
            longitude = favorite_restaurant.lng,
            )
        db.add(db_restaurant)
        db.flush()

    return db_restaurant

def get_existing_save(db:Session,user_id:str, restaurant_id:int) -> Restaurant | None:
    stmt = select(Favorite).where(Favorite.user_id == user_id, Favorite.restaurant_id == restaurant_id)

    return db.execute(stmt).scalars().first()


def add_or_update_save(db:Session,user_id:str, restaurant_id:int,favorite:FavoriteModel,restaurant:Restaurant) -> Restaurant:
    
    existing_save = get_existing_save(db,user_id,restaurant_id)

    if existing_save:
        db.flush()
        return restaurant
    else:
        db.add(Favorite(
                user_id = favorite.user_id,
                restaurant_id = restaurant.id,
            ))
        db.flush()
        return restaurant

def add_save(favorite:Favorite,db:Session) -> FavoriteModel:

    try:
        get_or_create_user(favorite.user_id,db)

        restaurant = get_or_create_restaurant(favorite,db)
        add_or_update_save(db,favorite.user_id,restaurant.id,favorite,restaurant)
        db.commit()
        return restaurant

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")

def remove_favorite(user_id: str, place_id: str, db: Session) -> None:
    try:
        get_or_create_user(user_id, db)

        stmt = select(Restaurant).where(Restaurant.google_place_id == place_id)
        restaurant = db.execute(stmt).scalars().first()
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")

        favorite_to_delete = get_existing_save(db, user_id, restaurant.id)
        if not favorite_to_delete:
            raise HTTPException(status_code=404, detail="Favorite not found")

        db.delete(favorite_to_delete)
        db.commit()

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")
    
def get_user_favorites(user_id:str, db:Session) -> List[dict]:
    try:
        stmt = select(Favorite).where(Favorite.user_id == user_id)
        all_favorites = db.execute(stmt).scalars().all()
        
        restaurants = [ {"restaurant_id":favorite.restaurant_obj.id,
                        "google_place_id":favorite.restaurant_obj.google_place_id,
                        "name":favorite.restaurant_obj.name,
                        "lat":favorite.restaurant_obj.latitude,
                        "lng":favorite.restaurant_obj.longitude,
                        "created_at":favorite.created_at.isoformat()
                        } for favorite in all_favorites]
        return {"favorites":restaurants}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")
