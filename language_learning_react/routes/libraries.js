const express = require("express");
const router = express.Router();

const log = console.log;

// to validate object IDs
const { ObjectID } = require('mongodb')

//library model
const { Library } = require('../models/library')

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

//GET all libraries for a user
router.get('/', authenticate, (req, res) => {
    Library.find({
		creator: req.user._id // from authenticate middleware
	}).then((libraries) => {
		res.send({ libraries }) // can wrap in object if want to add more properties
	}, (error) => {
		res.status(500).send(error) // server error
	})
})


//GET a library for a user
router.get('/:id', authenticate, (req, res) => {
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}

	// Otherwise, find by the id and creator
	Library.findOne({_id: id, creator: req.user._id}).then((library) => {
		if (!library) {
			res.status(404).send()  // could not find this library
		} else {   
			res.send(library)
		}
	}).catch((error) => {
		res.status(500).send()  // server error
	})
})


//POST a new library for a user
router.post('/', authenticate, (req, res) => {
	// Create a new library using the library mongoose model
	const library = new Library({
        name: req.body.name,
        words: [],
		creator: req.user._id // creator id from the authenticate middleware
	})

	// Save library to the database
	library.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})


//DELETE a library by id
router.delete('/:id', authenticate, (req, res) => {
	const id = req.params.id

	if(!ObjectID.isValid(id)){
		res.status(404).send()
		return;
    }

	Library.findOneAndDelete({_id: id, creator: req.user._id}).then((library) => {
		if (!library) {
			res.status(404).send()
		} else {   
			res.send(library)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})


//PATCH update a library by id 
router.patch('/:id', authenticate, (req, res) => {
	const id = req.params.id

	const { name, words } = req.body
	const body = { name, words }

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	// Update the library by their id.
	Library.findOneAndUpdate({_id: id, creator: req.user._id}, {$set: body}, {new: true}).then((library) => {
		if (!library) {
			res.status(404).send()
		} else {   
			res.send(library)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the library.
    })
})


/*********************************************************/
/** Words resource routes **/
//POST a word for a lib
router.post('/:lib_id', authenticate, (req, res) => {
	// Create a new library using the library mongoose model
	const word = {
        word: req.body.word,
        translations: [{
			fl: req.body.fl,
			def: req.body.def
		}]
	}
	const libId = req.params.lib_id
	if (!ObjectID.isValid(libId)) {
		res.status(404).send()
		return;
	}
	Library.findById(libId).then(lib => {
		if (!lib) {
			res.status(404).send()
		}else {
			const oldWords = lib.words
			oldWords.push(word)
			Library.findByIdAndUpdate(libId,
				{
					$set: {
						words:oldWords
					}
				}, {new : true})
				.then(lib => {
					res.send({word, lib});
				})
				.catch(error => {
					res.status(400).send(error);
				});
		}
	});
	
});

//GET a word for a lib
router.get('/:lib_id/:word_id',authenticate, (req, res) => {
    const libId = req.params.lib_id
    const wordId = req.params.word_id

	if(!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)){
		res.status(404).send()
		return;
	}

	Library.findById({_id: libId, creator: req.user._id}).then((library)=> {
		if(!library){
			res.status(404).send()
		}else{
			//get word by word id
			const word = library.words.id(wordId)
			res.send(word)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})


//DELETE a word by id
router.delete('/:lib_id/:word_id',authenticate, (req, res) => {
	const libId = req.params.lib_id
    const wordId = req.params.word_id

	if(!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)){
		res.status(404).send()
		return;
	}

	Library.findById({_id: libId, creator: req.user._id}).then((library) => {
		let returned = {}
		//get word by word id
		returned.word = library.words.id(wordId)

		library.words.remove(wordId)
		returned.library = library

		//save to library database
		library.save().then((result) => {
			res.send(returned)
		}, (error) => {
			res.status(400).send(error)
		})

	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})


//PATCH update a word by id 
router.patch('/:lib_id/:word_id',authenticate, (req, res) => {
	const libId = req.params.lib_id
    const wordId = req.params.word_id

	if(!ObjectID.isValid(libId) || !ObjectID.isValid(wordId)){
		res.status(404).send()
		return;
	}
	
	Library.findById({_id: libId, creator: req.user._id}).then((library) => {
		if (!library) {
			res.status(404).send()
		} else {
			library.words.id(wordId).set({
				learnStatus: !req.body.learnStatus
			})

			let returned ={}
			returned.word = library.words.id(wordId)
			returned.library = library

			library.save().then((result) => {
				res.send(returned)
			}, (error) => {
				res.status(400).send(error)
			})		
		}
	}).catch((error) => {
		res.status(500).send()
	})	
})


module.exports = router;