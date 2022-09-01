import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
    page: 1,
  });

  const unsplashResults = photos.response?.results || [];

  return unsplashResults.map((res) => res.urls["small"]);
};

export const fetchCoffeeStores = async (latLong = "37.034819570074845%2C37.31809465776804", limit = 6) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const res = await fetch(
    getUrlForCoffeeStores(
      //
      latLong,
      "coffee",
      limit
    ),
    options
  );

  const data = await res.json();

  return data.results.map((res, i) => {
    return {
      id: res.fsq_id,
      // address: res.location.address,
      address2: res.location.formatted_address,
      street: res.location.cross_street,
      street2: res.location.locality,
      name: res.name,
      imgUrl: photos.length > 0 ? photos[i] : null,
      key: res.name,
    };
  });
};
