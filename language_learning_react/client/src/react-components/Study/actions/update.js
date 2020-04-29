 
 //show the next card of current library after updated the card's learn status
 //update the flashcards information for current state
 export const updateCard = (learncards, words)  => {
	 	const learning = words.filter(word => word.learnStatus);
		const review = words.filter(word => !word.learnStatus);
		const library_words = learncards.props.learnModule ? learning : review;

    learncards.setState(prevState => {
      const idx = Math.min(
        prevState.index,
        library_words.length - 1
      );
      return {
        flashcards: library_words,
        selectedCardId: library_words.length !== 0 ? library_words[idx]._id : '',
        index: idx
      };
    });
  };


  //show the first card after switched the library
  //update the flashcards information for current state
  export const updateLibrary = (studyComp, learncards)  => {
    const words = studyComp.state.library.words;
    const learning = words.filter(word => word.learnStatus);
		const review = words.filter(word => !word.learnStatus);
		const library_words = learncards.props.learnModule ? learning : review;

    learncards.setState({
      flashcards: library_words,
      selectedCardId: library_words.length !== 0 ? library_words[0]._id : '', 
      index: 0
    });
  };