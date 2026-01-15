from fastapi import APIRouter
from fastapi import HTTPException,Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database.schemas import session
from app.dependencies import get_db
from app.services.restaurant_service import find_restaurant


router  = APIRouter(prefix= "/api/v1/restaurant", tags=["restaurant"])


@router.get("/{place_id}")
def get_restaurant(place_id:str,db:Session = Depends(get_db)):
    try:
        
        restaurant = find_restaurant(place_id,db)

        return {"place":
                {"place_id": place_id, "name": restaurant.name, 
                "lat":restaurant.latitude,"lng":restaurant.longitude}}
    except HTTPException:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail=f"Database error {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")