from pydantic import BaseModel
from typing import List,Literal

class SearchResponse(BaseModel):
    name:str
    address:str
    lat:float
    lng:float
    rating:float | None=None
    user_ratings_total:int |None=None #total number of ratings
    place_id:str # each establishment has its own unique id
    open_now:bool | None=None
    photo_urls: List[str] = []
    types: List[str] = []
 
class Favorite(BaseModel):
    place_id:str
    place_name:str
    lat:float
    lng:float
    user_id:str
    swipe_direction: Literal["left","right"]

