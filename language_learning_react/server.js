"use strict";
const log = console.log;

// create server with express
const express = require("express");
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const { Library } = require("./models/library");
const { Recommendation } = require("./models/recommendations");
const { DefaultLibrary } = require("./models/default");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// middleware to access static src
const path = require("path");
app.use(express.static(__dirname + "/client/build"));

// to validate object IDs
const { ObjectID } = require("mongodb");

// cloudinary: configure using credentials found on your Cloudinary Dashboard
// sign up for a free account here: https://cloudinary.com/users/register/free
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dabhhwnqz",
  api_key: "794148773328635",
  api_secret: "ljl4wZbBNS0TpYgUC_xdR6BxsBo"
});

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// Create a session cookie
app.use(
  session({
    secret: "oursecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60000,
      httpOnly: true
    }
  })
);

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user)
      .then(user => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch(error => {
        res.status(401).send("Unauthorized");
      });
  } else {
    res.status(401).send("Unauthorized");
  }
};

// Middleware for admin authentication of resources
const authenticateAdmin = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user)
      .then(user => {
        if (!user || user.type !== "admin") {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch(error => {
        res.status(401).send("Unauthorized admin");
      });
  } else {
    res.status(401).send("Unauthorized admin");
  }
};

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

/*********************************************************/

/*** Users API Routes below ************************************/

/*** Authentication API Routes below ************************************/
// A route to check if a use is logged in on the session cookie
app.get("/users/check-session", (req, res) => {
  if (req.session.user) {
    res.send({
      user: req.session.name,
      type: req.session.type,
      image: req.session.image
    });
  } else {
    res.status(401).send();
  }
});

// A route to logout a user, destory the user session 
app.get("/users/logout", (req, res) => {
  // Remove the session
  User.findById(req.session.user).then(result => {
    if (!result) {
      res.status(404).send();
    } else {
      result.login = false;
      result
        .save()
        .then(sucess =>
          req.session.destroy(error => {
            if (error) {
              res.status(500).send(error);
            } else {
              res.send();
            }
          })
        )
        .catch(e => res.status(500).send(e));
    }
  });
});

// A route to login, send name and password and create a session for the user
app.post("/users/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  // Use the static method on the User model to find a user
  // by their email and password
  User.findByNamePassword(name, password)
    .then(user => {
      // Add the user's id to the session cookie.
      // We can check later if this exists to ensure we are logged in.
      req.session.user = user._id;
      req.session.name = user.name;
      req.session.type = user.type;
      req.session.image = user.image_url;
      console.log("user image:", user.image_url);
      res.send({ user: user.name, type: user.type, image: user.image_url });
    })
    .catch(error => {
      res.status(400).send();
    });
});

// route to change user login status to true when loggin
app.patch("/users/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  User.findByNamePassword(name, password)
    .then(user => {
      if (!user) {
        res.status(404).send();
      } else {
        user.login = true;
        user.save().then(result => {
          res.send(result);
        });
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

/*** Recommendation API Routes below ************************************/
// route to check whether the word is recommended
app.get("/checkRecommendation", authenticate, (req, res) => {
  console.log(req.query.word);
  Recommendation.findOne({ word: req.query.word })
    .then(words => {
      console.log("check",words)
      if (words) {
        res.send(words);
      } else {
        DefaultLibrary.findOne({ word: req.query.word })
          .then(word => res.send(word))
          .catch(e => res.status(404).send(e));
      }
    })
    .catch(error => {
      res.status(404).send(error);
    });
});
// route to get all pending word
app.get("/recommend", authenticateAdmin, (req, res) => {
  Recommendation.find()
    .then(words => {
      res.send(words);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// route to add word into recommendations
app.post("/recommendations", authenticate, (req, res) => {
  const recommendation = new Recommendation({
    word: req.body.word,
    translation: req.body.translation,
    creator: req.user._id,
    source: req.body.source,
    userName: req.user.name
  });
  recommendation
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});
//check whether the words in defaultLibrary are also in user's library
app.get("/defaultLibraryAndCheck", authenticate, (req, res) => {
  const userId = req.user._id;
  if (!ObjectID.isValid(userId)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }
  DefaultLibrary.find()
    .then(result => {
      const words = result.map(x => x.word);
      console.log("words", words);
      Library.find({ creator: userId, "words.word": { $in: words } }).then(
        libs => {
          console.log("lib", libs);
          const reducer = (total, cur) => {
            const pureWords = cur.words.reduce((total, cur) => {
              total.push(cur.word);
              return total;
            }, []);
            return total.concat(pureWords);
          };
          const allWords = libs.reduce(reducer, []);
          console.log("allWords", allWords);
          const checker = (total, cur) => {
            const word = {
              word: cur.word,
              source: cur.source,
              translation: cur.translation
            };

            if (allWords.includes(cur.word)) {
              word.saved = true;
            } else {
              word.saved = false;
            }
            total.push(word);
            console.log("word", word);
            return total;
          };
          console.log("result", result);
          const checkWords = result.reduce(checker, []);
          console.log("checked", checkWords);
          res.send(checkWords);
        }
      );
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// route to add word to default library from recommendation list by sending a newly construct word
app.post("/addWord/defaultLib", authenticateAdmin, (req, res) => {
  const newWord = new DefaultLibrary({
    word: req.body.word,
    source: req.body.source,
    translation: req.body.translation,
    learnStatus: true
  });
  newWord
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// route to get all words from default library
app.get("/defaultLibrary", authenticateAdmin, (req, res) => {
  DefaultLibrary.find()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// route to reject recommend word in admin by sending name of the word
app.delete("/delete/recommend/:wordName", authenticateAdmin, (req, res) => {
  const name = req.params.wordName;
  console.log(name);
  Recommendation.findOneAndDelete({ word: name })
    .then(result => {
      res.send(result);
    })
    .catch(error => res.status(500).send());
});

// route to delete word in default library by sending name of the word
app.delete("/delete/default/:wordName", authenticateAdmin, (req, res) => {
  const name = req.params.wordName;
  console.log(name);
  DefaultLibrary.findOneAndDelete({ word: name })
    .then(result => {
      res.send(result);
    })
    .catch(error => res.status(500).send());
});

/*** User API Routes below ************************************/
// route to get all users
app.get("/users", authenticateAdmin, (req, res) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// route to suspend user from admin by sending the user's name
app.patch("/suspend/:userName", authenticateAdmin, (req, res) => {
  const userName = req.params.userName;
  User.findOne({ name: userName })
    .then(user => {
      if (!user) {
        res.status(404).send();
      } else {
        if (user.suspend === true) {
          user.suspend = false;
        } else {
          user.suspend = true;
        }
        user.save().then(success => {
          res.send(success);
        });
      }
    })
    .catch(error => res.status(500).send);
});

// route to change password for user from admin page by sending the user's username and password
app.patch(
  "/changePassword/:userName/:newPassword",
  authenticateAdmin,
  (req, res) => {
    const userName = req.params.userName;
    const newPassword = req.params.newPassword;
    User.findOne({ name: userName })
      .then(user => {
        if (!user) {
          res.status(404).send();
        } else {
          user.password = newPassword;
          user.save().then(success => {
            res.send(success);
          });
        }
      })
      .catch(error => res.status(500).send);
  }
);

// A route to the specific library
app.get("/checkSave", authenticate, (req, res) => {
  const userId = req.user._id;
  const word = req.query.word;
  if (!ObjectID.isValid(userId)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }
  Library.findOne({ creator: userId, "words.word": word })
    .then(libs => {
      console.log(libs);
      res.send(libs);
    })
    .catch(e => res.status(404).send());
});

// A route to change user name from user webpage
app.patch("/users/changeName", authenticate, (req, res) => {
  const uid = req.user._id;
  const newName = req.body.name;
  User.findByIdAndUpdate(
    uid,
    {
      $set: {
        name: newName
      }
    },
    { new: true }
  )
    .then(user => {
      if (!user) {
        res.status(404).send();
      } else {
        req.session.name = newName;
        res.send({ user: user.name });
      }
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

// A route to change password from a user webpage
app.patch("/users/changePass", authenticate, (req, res) => {
  const uid = req.user._id;
  const newPassword = req.body.password;
  User.findById(uid)
    .then(user => {
      if (!user) {
        res.status(404).send();
      } else {
        user.password = newPassword;
        user.save().then(success => {
          res.send(success);
        });
      }
    })
    .catch(error => res.status(400).send(error));
});

// route to add newly registered user
app.post("/addUser", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: req.body.password,
    type: req.body.type,
    suspend: req.body.suspend,
    image_id: "sv4ndpot5tlrnyk6bagi",
    image_url:
      "http://res.cloudinary.com/dabhhwnqz/image/upload/v1585682238/sv4ndpot5tlrnyk6bagi.jpg",
    login: false
  });
  console.log(newUser);
  newUser
    .save()
    .then(result => {
      //Also add a new lib
      DefaultLibrary.find().then(allWord => {
        console.log(allWord);
        const newLib = new Library({
          name: "default",
          //Use user's id
          creator: result._id,
          words: allWord
        });

        newLib.save().then(libresult => {
          console.log(libresult);
          res.send(libresult);
        });
      });
    })
    .catch(e => res.status(500).send(error))
    .catch(e => res.status(500).send(error))
    .catch(error => {
      res.status(500).send(error); // server error
    });
});

/*********************************************************/

/*** Libraries API Routes below ************************************/

//GET all libraries for a user
app.get("/libraries", authenticate, (req, res) => {
  Library.find({
    creator: req.user._id // from authenticate middleware
  }).then(
    libraries => {
      res.send({ libraries }); // can wrap in object if want to add more properties
    },
    error => {
      res.status(500).send(error); // server error
    }
  );
});

//GET a library for a user
app.get("/libraries/:id", authenticate, (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return;
  }

  // Otherwise, find by the id and creator
  Library.findOne({ _id: id, creator: req.user._id })
    .then(library => {
      if (!library) {
        res.status(404).send(); // could not find this library
      } else {
        res.send(library);
      }
    })
    .catch(error => {
      res.status(500).send(); // server error
    });
});

//POST a new library for a user
app.post("/libraries", authenticate, (req, res) => {
  // Create a new library using the library mongoose model
  const library = new Library({
    name: req.body.name,
    words: [],
    creator: req.user._id // creator id from the authenticate middleware
  });

  // Save library to the database
  library.save().then(
    result => {
      res.send(result);
    },
    error => {
      res.status(400).send(error); // 400 for bad request
    }
  );
});

//DELETE a library by id
app.delete("/libraries/:id", authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  Library.findOneAndDelete({ _id: id, creator: req.user._id })
    .then(library => {
      if (!library) {
        res.status(404).send();
      } else {
        res.send(library);
      }
    })
    .catch(error => {
      res.status(500).send(); // server error, could not delete.
    });
});

/*********************************************************/

/*** Words API Routes below ************************************/

//POST a word for a lib
app.post("/libraries/:lib_id", authenticate, (req, res) => {
  const word = {
    word: req.body.word,
    translation: req.body.translation,
    learnStatus: true,
    source: req.body.source
  };
  console.log(word);
  const uid = req.user._id;
  const libId = req.params.lib_id;
  if (!ObjectID.isValid(libId)) {
    res.status(404).send();
    return;
  }
  //add a new word to current library
  Library.findOneAndUpdate(
    { creator: uid, _id: libId },
    {
      $push: { words: word }
    },
    { new: true }
  )
    .then(lib => {
      console.log(lib);
      res.send(lib);
    })
    .catch(e => res.status(404).send(e));
});

// GET a word for a lib
app.get("/libraries/:lib_id/:word_id", authenticate, (req, res) => {
  const libId = req.params.lib_id;
  const wordId = req.params.word_id;

  if (!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)) {
    res.status(404).send();
    return;
  }

  Library.findById({ _id: libId, creator: req.user._id })
    .then(library => {
      if (!library) {
        res.status(404).send();
      } else {
        //get word by word id
        const word = library.words.id(wordId);
        res.send(word);
      }
    })
    .catch(error => {
      res.status(500).send();
    });
});

//DELETE a word by id
app.delete("/libraries/:lib_id/:word_id", authenticate, (req, res) => {
  const libId = req.params.lib_id;
  const wordId = req.params.word_id;

  if (!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)) {
    res.status(404).send();
    return;
  }

  Library.findById({ _id: libId, creator: req.user._id })
    .then(library => {
      let returned = {};
      //get word by word id
      returned.word = library.words.id(wordId);

      library.words.remove(wordId);
      returned.library = library;

      //save to library database
      library.save().then(
        result => {
          res.send(returned);
        },
        error => {
          res.status(400).send(error);
        }
      );
    })
    .catch(error => {
      res.status(500).send(); // server error, could not delete.
    });
});

// PATCH update a word by id
app.patch("/libraries/:lib_id/:word_id", authenticate, (req, res) => {
  const libId = req.params.lib_id;
  const wordId = req.params.word_id;

  if (!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)) {
    res.status(404).send();
    return;
  }

  Library.findById({ _id: libId, creator: req.user._id })
    .then(library => {
      if (!library) {
        res.status(404).send();
      } else {
        //get word by word id
        // and change its learnStatus
        library.words.id(wordId).set({
          learnStatus: !req.body.learnStatus
        });
        let returned = {};
        returned.word = library.words.id(wordId);
        returned.library = library;
        //save to library database
        library.save().then(
          result => {
            res.send(returned);
          },
          error => {
            res.status(400).send(error);
          }
        );
      }
    })
    .catch(error => {
      res.status(500).send();
    });
});

// route to find translation for a word
app.get("/word", authenticate, (req, res) => {
  const word = req.query.word;
  const source = req.query.source;
  const key = "c538cbd4-5657-4d53-ac92-9f3c6ae84524";
  // the URL for the request
  const url = `https://dictionaryapi.com/api/v3/references/spanish/json/${word}?key=${key}`;

  // The data we are going to send in our request
  // Create our request constructor with all the parameters we need

  // Make a request for a user with a given ID
  const regex = new RegExp("^" + word + "(:\\d+)?" + "$");
  console.log("here");

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
      //handle the case when we can not find translation
      if (!filtered) {
        res.status(404).send();
        return null;
      }

      const translations = filtered.map(x => {
        if (x.fl && x.shortdef) {
          if (x.shortdef.length != 0) {
            return { fl: x.fl, def: x.shortdef };
          }
        }
      });

      const resultWord = {
        word: word,
        source: source,
        translate: translations
      };
      console.log(resultWord);
      res.send(resultWord);
    })
    .catch(e => {
      console.log(e);
      res.status(500).send(e);
    });
});

/*********************************************************/

/*** Image API Routes below ************************************/

// a POST route to upload profile img
app.post("/images", [authenticate, multipartMiddleware], (req, res) => {
  console.log("post profile img user id on server:", req.user._id);
  console.log("req files:", req.files.image.size);
  console.log("req files image size == 0:", req.files.image.size == 0);
  // Use uploader.upload API to upload image to cloudinary server.
  if (req.files.image.size == 0) {
    console.log("if size==0:", req.files.image.size == 0);
    res.status(400).send();
    return;
  }
  cloudinary.uploader.upload(
    req.files.image.path, // req.files contains uploaded files
    function(result) {
      // Save image to the database
      User.findById({ _id: req.user._id })
        .then(user => {
          user.image_id = result.public_id;
          user.image_url = result.url;
          user.save().then(
            user => {
              res.send({ image_url: user.image_url });
            },
            error => {
              res.status(400).send(error); // 400 for bad request
            }
          );
        })
        .catch(error => {
          res.status(400).send(error);
        });
    }
  );
});

// All routes other than above will go to index.html which is our mainpage
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
