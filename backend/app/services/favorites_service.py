from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from typing import List
from app.database.schemas import Restaurant,User,Swipe
from app.models.favorite import Favorite


def get_or_create_user(user_id:str,db:Session) -> User:
    stmt = select(User).where(User.id == user_id)
    db_user = db.execute(stmt).scalars().first()
    if not db_user:
        db_user = User(id=user_id)
        db.add(db_user)
        db.flush()
    return db_user

def get_or_create_restaurant(favorite_restaurant:Restaurant,db:Session) -> Swipe| None:
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

def get_existing_save(db:Session,user_id:str, restaurant_id:int) -> Restaurant:
    stmt = select(Swipe).where(Swipe.user_id == user_id, Swipe.restaurant_id == restaurant_id)

    return db.execute(stmt).scalars().first()


def add_or_update_save(db:Session,user_id:str, restaurant_id:int,favorite:Favorite,restaurant:Restaurant) -> Restaurant:
    
    existing_save = get_existing_save(db,user_id,restaurant_id)

    if existing_save:
        existing_save.swipe_direction = favorite.swipe_direction
        
        
    else:
        db.add(Swipe(
                user_id = favorite.user_id,
                restaurant_id = restaurant.id,
                swipe_direction = favorite.swipe_direction,
            ))
        db.flush()
        return restaurant
def add_save(favorite:Favorite,db:Session) -> Restaurant:

    try:
        get_or_create_user(favorite.user_id,db)

        restaurant = get_or_create_restaurant(
            favorite.place_id,
            favorite.place_name,
            favorite.lat,
            favorite.lng,
            db
        )
        db.commit()
        return add_or_update_save(favorite,restaurant,db)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")

def get_favorites(user_id:str, db:Session) -> List[dict]:
    stmt = select(Swipe).where(Swipe.user_id == user_id, Swipe.swipe_direction == "right")
    all_favorites = db.execute(stmt).scalars().all()
        
    restaurants = [ {"restaurant_id":right_swipe.restaurant_obj.id,
                        "google_place_id":right_swipe.restaurant_obj.google_place_id,
                        "name":right_swipe.restaurant_obj.name,
                        "lat":right_swipe.restaurant_obj.latitude,
                        "lng":right_swipe.restaurant_obj.longitude,
                        "swiped_at":right_swipe.swiped_at.isoformat()
                        } for right_swipe in all_favorites]
    return {"favorites":restaurants}