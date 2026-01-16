from fastapi import APIRouter
from fastapi import HTTPException
from typing import List
from app.services.search_service import search_by_text_places, format_search_places_response
from app.models.search import SearchResponse
import logging

router = APIRouter(prefix="/api/v1/search",tags=["search"])

logger = logging.getLogger(__name__)

@router.get("/",response_model=List[SearchResponse])
async def search(query:str, lat:float,lng:float):
    try :
        raw_json = search_by_text_places(query,lat,lng)

        return format_search_places_response(raw_json)
    except Exception as e:
        print(f"Error {e}")
        logger.error(f"Query {query} unsuccessful: {e}")
        raise HTTPException(status_code=500, detail=f"{e}")

    
