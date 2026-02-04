import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Search for restaurants by query and location
 * @param {string} query - Search query
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array>} Array of restaurant results
 */
export async function searchRestaurants(query, lat, lng) {
  try {
    const response = await api.get('/api/v1/search', {
      params: {
        query,
        lat,
        lng,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
}

/**
 * Get restaurant details by place ID
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Restaurant details
 */
export async function getRestaurant(placeId) {
  try {
    const response = await api.get(`/api/v1/restaurant/${placeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
}

/**
 * Get the authenticated user's favorite restaurants.
 * The backend infers the user from the Supabase JWT in the Authorization header.
 * @param {string} accessToken - Supabase JWT access token
 * @returns {Promise<Array>} Array of favorite restaurants
 */
export async function getFavorites(accessToken) {
  try {
    const response = await api.get('/api/v1/favorite/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Add restaurant to favorites.
 * @param {Object} favoriteData - Favorite data {place_id, place_name, lat, lng}
 * @param {string} accessToken - Supabase JWT access token
 * @returns {Promise<Object>} Added favorite
 */
export async function addFavorite(favoriteData, accessToken) {
  try {
    const response = await api.post('/api/v1/favorite/', favoriteData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

/**
 * Remove restaurant from favorites.
 * @param {string} placeId - Google Place ID
 * @param {string} accessToken - Supabase JWT access token
 * @returns {Promise<Object>} Deletion result
 */
export async function removeFavorite(placeId, accessToken) {
  try {
    const response = await api.delete(`/api/v1/favorite/${placeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export default {
  searchRestaurants,
  getRestaurant,
  getFavorites,
  addFavorite,
  removeFavorite,
};
