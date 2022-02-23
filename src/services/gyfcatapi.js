import axios from "axios";

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
