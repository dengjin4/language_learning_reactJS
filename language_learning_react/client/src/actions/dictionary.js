const log = console.log;
const axios = require("axios");
//lookup a word from the dictionary
export function lookup(dict) {
  const source = dict.state.source.toLowerCase();
  const word = dict.state.word.toLowerCase();
  const key = "c538cbd4-5657-4d53-ac92-9f3c6ae84524";
  // the URL for the request
  const url = `https://dictionaryapi.com/api/v3/references/spanish/json/${word}?key=${key}`;

  // The data we are going to send in our request
  // Create our request constructor with all the parameters we need

  // Make a request for a user with a given ID
  const regex = new RegExp("^" + word + "(:\\d+)?" + "$");
  log("here");

  axios
    .get(url)
    .then(function(response) {
      if (response.status != 200) {
        dict.setState({ status: false });
        return null;
      }
      //filter for the translation we need
      const filtered = response.data.filter(x => {
        if (x.meta) {
          return x.meta.lang === source && regex.test(x.meta.id.toLowerCase());
        } else {
          return false;
        }
      });
      //handle
      if (!filtered) {
        dict.setState({ status: false });
        return null;
      }

      // get the audio
      const pronouce = [];
      for (let i = 0; i < filtered.length; i++) {
        try {
          const prs = filtered[i].hwi.prs;
          for (let j = 0; j < prs.length; j++) {
            if (prs[j].sound.audio) {
              pronouce.push(prs[j]);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      let audio = null;
      const audioBeginD = new RegExp("^" + "[\\d,_]");
      const audioBeginB = new RegExp("^" + "bix");
      const audioBeginG = new RegExp("^" + "gg");
      if (pronouce.length > 0) {
        audio = pronouce.map(x => {
          const a = x.sound.audio;
          let url;
          if (audioBeginD.test(a)) {
            url = `https://media.merriam-webster.com/soundc11/number/${a}.wav`;
          } else if (audioBeginB.test(a)) {
            url = `https://media.merriam-webster.com/soundc11/bix/${a}.wav`;
          } else if (audioBeginG.test(a)) {
            url = `https://media.merriam-webster.com/soundc11/gg/${a}.wav`;
          } else {
            url = `https://media.merriam-webster.com/soundc11/${a.charAt(
              0
            )}/${a}.wav`;
          }
          return { audio: url, mw: x.mw };
        });
      }
      const translations = filtered.map(x => {
        if (x.fl && x.shortdef) {
          if (x.shortdef.length != 0) {
            return { fl: x.fl, def: x.shortdef };
          }
        }
      });
      if (audio) {
        dict.setState({ audio: audio[0].audio, mw: audio[0].mw, sound: true });
      } else {
        dict.setState({ sound: false });
      }
      dict.setState({ translations: translations });

      //now we can check the status of the word
    })
    .catch(function(error) {
      // handle error
      log(error);
    });

  // Send the request with fetch()
}

//check whether the word is recommended by this user
export function checkRecommendation(dict) {
  const word = dict.state.word.toLowerCase();
  const url = "/checkRecommendation";
  axios
    .get(url, {
      params: {
        word: word
      }
    })
    .then(recommendation => {
      log(recommendation);
      if (recommendation.data.word) {
        dict.setState({ recommended: true });
      }
    })
    .catch(e => log(e));
}
// check wwhether the word is saved by this user
export function checkSaved(dict) {
  const word = dict.state.word.toLowerCase();
  const url = "/checkSave";
  axios
    .get(url, {
      params: {
        word: word
      }
    })
    .then(libs => {
      log(libs);
      if (libs.data !== "") {
        dict.setState({ saved: true });
      }
    })
    .catch(e => log(e));
}

//add this word to the library with this id
export function addWord(dict, lib_id) {
  const url = "/libraries/".concat(lib_id);
  axios
    .post(url, {
      word: dict.state.word.toLowerCase(),
      translation: dict.state.translations,
      source: dict.state.source.toLowerCase()
    })
    .then(result => {
      dict.setState({ saved: true });
      log(result);
    })
    .catch(e => log(e));
}
// get all library for this user
export const getAllLib = dict => {
  // the URL for the request
  const url = "/libraries";

  axios
    .get(url)
    .then(res => {
      if (res.status === 200) {
        dict.setState({ learningLibrary: res.data.libraries });
        console.log(dict.state);
      }
    })
    .catch(error => {
      log(error);
    });
};
// add a new library for this user
export function addLib(dict) {
  const url = "/libraries";

  if (dict.state.libName.trim() == "") {
    alert("library name can not be empty!");
  } else {
    const newLib = {
      name: dict.state.libName
    };
    axios
      .post(url, newLib)
      .then(result => {
        dict.setState({ libCreate: false });
        // getAllLib(dict)
      })
      .catch(e => {
        log(e);
      });
  }
}
// add this word to the pending list
export function reconmmend(dict) {
  const url = "/recommendations";
  axios
    .post(url, {
      word: dict.state.word.toLowerCase(),
      translation: dict.state.translations,
      source: dict.state.source.toLowerCase()
    })
    .then(result => {
      dict.setState({ recommended: true });
      log(result);
    })
    .catch(e => {
      log(e);
    });
}
