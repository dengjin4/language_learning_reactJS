import axios from 'axios'
import { updateLibrary, updateCard } from "../react-components/Study/actions/update"

//set the library to default library and get all libraries for the current user
//using server call through axios
export const getDefaultLibraries = (studyComp) => {
	const url = "/libraries";
	axios.get(url)
	.then(res => {
		studyComp.setState({
		libraries: res.data.libraries, 
		isLoading:false, 
		library: res.data.libraries[0]
		})
	})
	.catch(err => console.error(err))
};


//GET all libraries for the current user
//set the libraries of current state to the latest all libraries
export const getLibraries = (studyComp) => {
	// the URL for the request
	const url = "/libraries";
	axios.get(url)
	.then(res => {
		studyComp.setState({libraries: res.data.libraries, isLoading:false})
	})
	.catch(err => console.error(err))
};


//GET the library for current user by library id
//set library to current state, and update the flashcards informations for flashcards
export const getLibrary = (studyComp, learncards, libId) => {
	// the URL for the request
	const url = "/libraries/" + libId;
	axios.get(url)
	.then(res => {
		studyComp.setState({library: res.data}, ()=>{
			//update the flashcards information for learncards component
			updateLibrary(studyComp, learncards)
		})
	})
	.catch(err => console.error(err))

};


//GET the word by library id and word id for current user
export const getWord = (word) => {
	// the URL for the request
	const url = "/libraries/" + word.state.libraryId + "/" + word.state.selectedCardId;
	console.log(url)
	axios.get(url)
	.then(res => {
		word.setState({flashcard: res.data.word, isLoading:false})
	})
	.catch(err => console.error(err))

};


//PATCH: update the learn status of current card
//update the flashcards, library, and libraries information for current user
//set the updated informations to the current states
export const updateLearnStatus = (studyComp, learncards, wordId) => {
	// the URL for the request
	const url = "/libraries/" + studyComp.state.library._id + "/" + wordId;

	const word = studyComp.state.library.words.find(w => w._id === wordId);

	// The data we are going to send in our request
	axios.patch(url, word)
	.then(res => {
		if (res.status === 200) {
			studyComp.setState({library: res.data.library}, ()=>{
				//update the flashcards information for learncards component
				updateCard(learncards, res.data.library.words)
			})
		}
		//update to the latest libraries information for current user
		getLibraries(studyComp);
	})
	.catch(error => {
			console.log(error);
	});
};