from pydantic import BaseModel
from typing import Literal


 
class Favorite(BaseModel):
    place_id:str
    place_name:str
    lat:float
    lng:float
    user_id:str
    swipe_direction: Literal["left","right"]