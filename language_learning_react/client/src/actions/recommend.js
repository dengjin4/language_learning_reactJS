const axios = require("axios");
const log = console.log;
// Get all the library for this user
export const getAllLib = page => {
  // the URL for the request
  const url = "/libraries";

  axios
    .get(url)
    .then(res => {
      if (res.status === 200) {
        page.setState({ libraries: res.data.libraries });
      }
    })
    .catch(error => {
      log(error);
    });
};
// get all words from the default library
export const getAllDefault = page => {
  // the URL for the request
  const url = "/defaultLibraryAndCheck";

  // Since this is a GET request, simply call fetch on the URL

  axios
    .get(url)
    .then(res => {
      if (res.status === 200) {
        const words = res.data;
        page.setState({ words: words });
      } else {
        alert("Could not get users");
      }
    })
    .catch(error => {
      console.log(error);
    });
};
//add a word from default library
export function addWord(word, lib_id) {
  const url = "/libraries/".concat(lib_id);
  axios
    .post(url, {
      word: word.word,
      translation: word.translation,
      source: word.source
    })
    .then(result => {
      log(result);
    })
    .catch(e => log(e));
}
//add a word from default library and set the state for recommend model and user profile
export function addDefaultWord(word, lib_id, recommendModel, profile) {
  const url = "/libraries/".concat(lib_id);
  axios
    .post(url, {
      word: word.word,
      translation: word.translation,
      source: word.source
    })
    .then(result => {
      getAllDefault(recommendModel);
      getAllLib(profile);
    })
    .catch(e => log(e));
}
