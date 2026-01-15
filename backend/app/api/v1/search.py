from fastapi import APIRouter
from fastapi import HTTPException
from typing import List
from app.services.search_service import search_by_text_places, format_search_places_response
from app.models.search import SearchResponse


router = APIRouter(prefix="/api/v1/search",tags=["search"])



@router.get("/",response_model=List[SearchResponse])
async def search(query:str, lat:float,lng:float):
    raw_json = search_by_text_places(query,lat,lng)

    if 'error' in raw_json:
        raise HTTPException(status_code=500, detail=raw_json['error'])

    return format_search_places_response(raw_json)
