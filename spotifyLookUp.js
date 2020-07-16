require("dotenv").config();
const fetch = require("node-fetch");
const request = require("request-promise-native");

//Im using a .env file, if you want to run them make your own

const base64Credentials = Buffer.from(
  `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
).toString("base64");

async function getSpotifyAccessData() {
  let accessData = await request({
    method: "POST",
    uri: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    json: true,
  });
  return accessData;
}

async function getData(searchTerms, type) {

  console.log("before access data");

  const accessData = await getSpotifyAccessData();
  
  console.log("after access data");


  if (accessData) {
    const token = accessData.access_token;

    let searchTerm = searchTerms.join("%20");

    console.log("Requesting spotify information");
    return fetch(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=${type}&limit=1&offset=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: true,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        let catagory = type + "s";
        let information = json[catagory].items[0];
        console.log(json[catagory].items[0]);
        if (catagory === "albums") {
          return {
            name: information.name,
            coverArt: information.images[0].url,
            link: information.external_urls.spotify,
            artist: information.artists[0].name,
            releaseDate: information.release_date,
          };
        } else if (catagory === "tracks") {
          return {
            name: information.name,
            coverArt: information.album.images[0].url,
            link: information.external_urls.spotify,
            artist: information.artists[0].name,
            releaseDate: information.album.release_date,
            preview: information.preview_url,
          };
        }
      });

    //   return fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     json: true,
    //   })
    //     .then((res) => res.json())
    //     .then((json) => {
    //       console.log("got spotify information");
    //       return {
    //         albumName: json.name,
    //         albumCoverArt: json.images[0].url,
    //         albumLink: json.external_urls.spotify,
    //         albumArtist: json.label,
    //         albumReleaseDate: json.release_date,
    //       };
    //     });
  }
}

module.exports = { getData: getData };
