# Language Learning Card
## About the website
The primary purpose of the website is for the user to expand their vocabulary, and we believe
online learning can give the user more flexibility and personalize their own learning pace.
Using the website, users can learn new vocabulary from a provided vocabulary list, review the learned vocabulary by a
self-test, look up new vocabulary through the dictionary and customize their vocabulary list. If a user believes that some word is suitable for beginning, he can recommend it, and the administrator will decide whether to add it to the provided vocabulary list for new users.

## How to use

Access the app using https://language-learning-heroku.herokuapp.com/

or

Following method only create an empty local database

`cd language_learning_react`

Start your local Mongo database. For example, in a separate terminal window:
```
# create and run local Mongo database in the root directory of the repo
mkdir mongo-data
mongod --dbpath mongo-data
```
Then, in the root directory of the repo, run:
```
# install server dependencies in the root directory
npm install

# install frontend dependencies in the client directory
cd client
npm install
```
Alternatively, you can run `npm run setup` in the root directory which runs a script to execute all the above commands (not including starting the mongo database, since it should be run in a separate window). This is a shortcut command defined in package.json.

### Devolopment
During development, run the following commands to build your React app and start the Express server. You should re-run these commands for your app to reflect any changes in the code. Make sure mongo is still running on a separate terminal.
```
# build the React app
cd client
npm run build

# go back to the root directory
cd ..

# run the server
node server.js
```
Alternatively, you can run `npm run build-run` in the root directory which runs a script to execute all the above commands. This is a shortcut command defined in package.json. After that the website can be access from `http://localhost:5000/` in the browser.

## Details for each page on the website

### Login/SignUp page
- The default user account: names: user, password: user
- The default admin account: names: admin, password: admin
- Users can sign up for a new account with by click the signup and fill out the required form (case sensitive)

### Main page
- Access user profile (by clicking the profile image at the top right)
- Come back main page (by clicking the home button at the top left)
- Lookup a word in the search bar（The search bar can be accessed by any page)

### User Profile page
This page shows user information, words in the learning module and words in the review module. The user can do:
- change user name, password and upload profile image
- library deletion and creation
- choose to remember word to learn again
- delete word
- add word from the default library

### Learning/Review page
These are two module pages for learning and reviewing the vocabulary. Learning module contains the words that have not learnt, and the review module contains words that have learnt. Once access into learning/review modules would first go to customized "default" library of current user and display the words in library of current user. 
After switching library through sidebar will display the words in selected library.
(word can be English/Spanish, based on which En/Es dictonary it used for searching)
New word will be added into the customized selected library
- Previous/Next arrow buttons to go to previous/next card
- "FLIP TO LEARN" button to see front/back side of card; front side is the word, back side is the translations (empty if no translation, based on En/Es dictionary when the word was searched)
- "REMEMBER" button in learning module: added word into review module and removed from learning module for current library
  (updated information for current library can be seen in sidebar)
- "LEARN AGAIN" button in review module: added word into learning module and removed from reivew module for current library
  (updated information for current library can be seen in sidebar)
 - After clickingg "REMEMBER"/"LEARN AGAIN" button, display the next card to be learned/reviewed


### SideBar
- Learning record in the sidebar about how many words in total have learnt for current library
- Contains the current information of all libraries for both learnin/review modules for current user
- Switch to other library through "GO TO LIBRARY" button below each library's expanded panel


### Dictionary
In the header, there is a search bar where you can look up either English or Spanish word.
Also, there will be a audio to pronouce this word, however, the audio for some words are missing because the third party api does not have it.
For each searched word, there are 2 buttons:
- (Add to list)

  The word will directly add to the current user learning library with meaning diccionario.

- (Recommend it)

  The word will wait for the admin to reject or approve. After approving the word will be added to the website default library (which is the default vocabulary for new users)
  

### Admin page
- In the search bar, type in the user's username, then press "enter" or click the magnifier to look up the user. If the user is found, admin could either suspend the user or change the user's password with a random generate password. When the switch is red, the user is banned from logging.

- "All user" button display all the users. The users are sorted in alphabetical order with capital letter having higher priority than lowercase letter.

- "Default Lib" button shows all the words from the default library. The admin could delete the word from the default library.

- "Pending words" button shows all the recommended word which is recommended from user in the dictionary. The admin could either reject or approve. If approve, the word will be added to the default library.

- "Stats" button shows all the statistics of the website.

## Note
The audio or meaning for some words are missing because the third party api does not provide it.

Due to some of the audio missing, to ensure rest of the webpage to be more coherent, the audio is only implemented in the dictionary to be considered as extra functionality.

The authentication cookie will expire in 30 minutes if the user is inactive.

## Overview of routes
### User API
- POST `/addUser` - post a new user with username and password. A new default library will be attached to the user, return the default library if save successful.
- POST `/images` - post a image with user authentication and multipart middleware, return the image url, used in profile page and header
- PATCH `/users/changeName` - change the user name given the name in http body with user authentication, return the username, used in profile page
- PATCH `/users/changePass` - change the user password given the password in http body with user authentication, return the user, used in profile page


### Library API: user authentication is required
- GET `/libraries` - load all libraries, used in profile page, learning page, review page 
- GET `/libraries/:id` - load a library given its id, used in profile page, learning page, review page 
- POST `/libraries` - create a new library given the name in http body, return this new library, used in profile page
- DELETE `/libraries/:id` - delete a library given library id, return this deleted library, used in profile page
- POST `/libraries/:lib_id` - add a new word to the given id library, return this library, used in profile page
- GET `/libraries/:lib_id/:word_id` - load a word given word id and library id, return the word, used in profile page
- DELETE `/libraries/:lib_id/:word_id` - delete a word given word id and library id, return this word and this library, used in profile page
- PATCH `/libraries/:lib_id/:word_id` - change the word learn status given word id and library id, return this word and this library, used in profile page, learning page, review page 

### Admin API: admin authentication is required
- POST `/addWord/defaultLib` - approve the word from recommend library and add it into default library, return the newly added word.
- GET `/recommend` - return all recommend word by user from the recommend library
- GET `/defaultLibrary` - return all word from the default library
- GET `/users` - return all users from the database
- DELETE `/delete/recommend/:wordName` - reject and delete word from recommend library, return the deleted word
- DELETE `/delete/default/:wordName` - delete word from default library, , return the deleted word
- PATCH `/suspend/:userName` - suspend a user from login if the user is not banned and activate if the user is banned, return the newly updated user
- PATCH `/changePassword/:userName/:newPassword` - find the user by username and change the user's password, return the newly updated user

### Authentication API
- GET `/users/check-session` -A route to check if a use is logged in on the session cookie, return {user,type,image} if found
- GET `/users/logout` - A route to logout a user, destory the user session and check the user status to be log out
- POST `/users/login` - A route to login,  bodys should contain name and password.. Check the user credentials and create a cookie for the user if the password and name matched
- PATCH `/users/login` -A route to change user login status to true when loggin, bodys should contain name and password.

### Recommendation API
- GET `/checkRecommendation` - A route to check whether the word is recommended, return the word if being recommended.
- POST `/recommendations` -add word into recommendations library，the body shouls contains word,translation,source, return the saved recommendation if succeed.
- GET `/defaultLibraryAndCheck` - check whether the words in defaultLibrary are also in user's library. return the words are are in both the user library and global default library




