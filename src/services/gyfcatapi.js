import axios from "axios";

/**
 * Fetch Environment Variables (requires .env file in app root)
 * IMPORTANT! This approach is not intended for production. Only to be
 * used for local development. Secrets should not be held client side,
 * alternatively:
 *  1. Use an auth server (exchange a temp token for real token)
 *  2. Browser-client authorisation
 */
const { REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } = process.env;

export async function generateToken() {
  try {
    const response = await axios.post("https://api.gfycat.com/v1/oauth/token", {
      grant_type: "client_credentials",
      client_id: REACT_APP_CLIENT_ID,
      client_secret: REACT_APP_CLIENT_SECRET,
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
}

/**
 * getTrendingGifs requests Gycat trending Gifs
 * @param accessToken bearer token provided to the get request
 * @returns array of trending gifs
 */
export async function getTrendingGifs(accessToken) {
  try {
    const response = await axios
      .get("https://api.gfycat.com/v1/reactions/populated?tagName=trending", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
        if ((error.repsonse.status = 401)) {
          console.log("Authorisation error occurred, reloading app");
          window.location.reload(); // TODO: add re-auth if token has expired, for now the app is reloaded to re-auth
        }
      });
    return response.data.gfycats;
  } catch (error) {
    console.log(error);
  }
}

/**
 * getRefinedGifs requests Gycat search Gifs endpoint based on a searchterm
 * @param accessToken bearer token provided to the get request
 * @param searchTerm parameter for Gycat to be searched by
 * @returns array of gifs based on searchTerm
 */
export async function getRefinedGifs(accessToken, searchTerm) {
  try {
    const response = await axios
      .get(
        `https://api.gfycat.com/v1/gfycats/search?search_text=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .catch((error) => {
        console.log("An error occurred:", error.response);
        if ((error.repsonse.status = 401)) {
          console.log("Authorisation error occurred, reloading app");
          window.location.reload(); // TODO: add re-auth if token has expired, for now the app is reloaded to re-auth
        }
      });
    return response.data.gfycats;
  } catch (error) {
    console.log(error);
  }
}
