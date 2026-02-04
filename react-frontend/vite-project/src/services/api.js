

const API_BASE_URL = 'http://127.0.0.1:8000';
export async function searchFood(query,lat,lng){

  const url = `${API_BASE_URL}/search?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch(error){
    console.error(error);
    return [];
  }

}
export default searchFood;