from main import app
from google_maps import search_by_text_places, format_search_places_response
from typing import List,Optional
from models import SearchResponse,Favorite
from fastapi import HTTPException,Depends
from pydantic import BaseModel
from database.schemas import session, Restaurant,Swipe,User
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError


def get_db():
    db = session()
    try: 
        yield db
    finally:
        db.close()






@app.get("/search", response_model=List[SearchResponse])
async def search(query:str, lat:float,lng:float):
    raw_json = search_by_text_places(query,lat,lng)

    if 'error' in raw_json:
        raise HTTPException(status_code=500, detail=raw_json['error'])

    return format_search_places_response(raw_json)


@app.post("/favorite")
def add_favorites(fav_restaurant:Favorite,db:Session = Depends(get_db)):

    try:
        stmt_1 = select(User).where(User.id == fav_restaurant.user_id)
        db_user = db.execute(stmt_1).scalars().first()
        if not db_user:
            db_user = User(id=fav_restaurant.user_id)
            db.add(db_user)
            db.flush()

        stmt_2 = select(Restaurant).where(Restaurant.google_place_id == fav_restaurant.place_id)
        db_restaurant = db.execute(stmt_2).scalars().first()
        if not db_restaurant:
            db_restaurant = Restaurant(
            google_place_id = fav_restaurant.place_id,
            name = fav_restaurant.place_name,
            latitude = fav_restaurant.lat,
            longitude = fav_restaurant.lng,
            )
            db.add(db_restaurant)
            db.flush()
        stmt_3 = select(Swipe).where(Swipe.user_id == fav_restaurant.user_id, Swipe.restaurant_id == db_restaurant.id)

        already_swiped = db.execute(stmt_3).scalars().first()
        if already_swiped:
            already_swiped.swipe_direction = fav_restaurant.swipe_direction
            db.commit()
            return {"message":db_restaurant}
        else:
            db.add(Swipe(
                user_id = fav_restaurant.user_id,
                restaurant_id = db_restaurant.id,
                swipe_direction = fav_restaurant.swipe_direction,
            ))
            db.commit()
            return {"message": db_restaurant}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error {e}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")

@app.get("/favorites/{user_id}")
def get_favorites(user_id:str,db:Session = Depends(get_db)):
    try:
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
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail=f"Database error {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error {e}")


@app.get("/restaurant/{place_id}")
def get_restaurant(place_id:str,db:Session = Depends(get_db)):
    try:
        stmt = select(Restaurant).where(Restaurant.google_place_id == place_id)
        restaurant = db.execute(stmt).scalars().first()

        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")

        return {"place":
                {"place_id": place_id, "name": restaurant.name, 
                "lat":restaurant.latitude,"lng":restaurant.longitude}}
    except HTTPException:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail=f"Database error {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

