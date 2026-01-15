from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database.schemas import Restaurant


def find_restaurant(place_id:str,db:Session) -> Restaurant:
    stmt = select(Restaurant).where(Restaurant.google_place_id == place_id)
    restaurant = db.execute(stmt).scalars().first()

    return restaurant