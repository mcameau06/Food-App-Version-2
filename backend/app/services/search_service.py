import requests
from app.core.config import GOOGLE_API_KEY 
from app.utils.keywords import FOOD_TYPES

api_key = GOOGLE_API_KEY


# new places api
def search_by_text_places(query: str, lat: float, lng: float):
    url = "https://places.googleapis.com/v1/places:searchText"
    
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.types,places.photos'
    }
    
    data = {
        "textQuery": query,
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng
                },
                "radius": 5000.0  # 5km radius
            }
        }
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print("Error", e)
        return {'error': f'Failed to fetch results, {response.status_code}'}
    except Exception as e:
        print("Error", e)
        return {'error': f'Failed to fetch results: {str(e)}'}









# legacy places api
def search_by_text_places1(query:str, lat:float, lng:float):
    url= f"https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        'location': f'{lat},{lng}',
        'query':query,
        'key':api_key, 
    }

    try:

        response = requests.get(url,params=params)
        response.raise_for_status()
        return response.json()
    
    except Exception as e:
        print("Error",e)
        return{'error':f'Failed to fetch results, {response.status_code}'}

def format_search_places_response1(raw_json):
    keywords = set(FOOD_TYPES)
    formatted = []
    
    for place in raw_json.get("results", []):

        place_types = place.get("types",[])

        is_food_place = bool(keywords.intersection(place_types))

        if is_food_place:
            photo_urls = []
            photos = place.get("photos",[])
            photo_url = None
            if photos and len(photos) > 0:
                for photo in photos:
                    photo_name = photo.get("name")
                    if photo_name:
                        photo_url = get_photo_url(photo_name)
                        photo_urls.append(photo_url)

            formatted.append({
                "name": place.get("name"),
                "address": place.get("formatted_address"),
                "lat": place.get("geometry", {}).get("location", {}).get("lat"),
                "lng": place.get("geometry", {}).get("location", {}).get("lng"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("user_ratings_total"),
                # can use to find place info
                "place_id": place.get("place_id"),
                "open_now": bool(place.get("opening_hours", {}).get("open_now")),
                "types": place.get("types", []),
                "photo_urls": photo_urls

            })
    return formatted


def format_search_places_response(raw_json):
    keywords = set(FOOD_TYPES)
    formatted = []
    
    # New API returns "places" not "results"
    for place in raw_json.get("places", []):
        place_types = place.get("types", [])
        is_food_place = bool(keywords.intersection(place_types))

        if is_food_place:
            photo_urls = []
            photos = place.get("photos", [])
            
            if photos and len(photos) > 0:
                for photo in photos:
                    photo_name = photo.get("name")
                    if photo_name:
                        photo_url = get_photo_url(photo_name)
                        photo_urls.append(photo_url)
            formatted.append({
                "name": place.get("displayName", {}).get("text", ""),
                "address": place.get("formattedAddress", ""),
                "lat": place.get("location", {}).get("latitude"),
                "lng": place.get("location", {}).get("longitude"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("userRatingCount"),
                "place_id": place.get("id"),
                "open_now": place.get("currentOpeningHours", {}).get("openNow", False),
                "types": place.get("types", []),
                "photo_urls": photo_urls
            })
    
    return formatted


def get_photo_url(photo_name, max_width=400):
    if not photo_name:
        return None
    return f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx={max_width}&maxWidthPx={max_width}&key={api_key}"
