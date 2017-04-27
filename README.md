# Lernkartei
A hybrid mobile app for studying using flashcards that concentrates on core features

## Motivation
I myself have used paper-based flashcards for memorizing the vocabulary of foreign languages in school and found that extremely effective and rewarding. Now my children are facing the same challenge and in the digital age the flash-cards should be presented on a computer or mobile phone of course.

Now this idea is not new a all. I looked at over a dozen flash-card apps on the android app-store and found them unsatisfactory. Man are infected by obnoxius advertising, some are very complex and claim to implement clever mnemonic algorithms, others are too simple again.

So for any self-respecting software person this is a prompt to roll their own. Let's see wether I can do better.

## Collection Of Ideas

This is a grab-bag of things that may make up a specification if worked on. This is a fun-project so there propably won't be such a thing but the list is here to reference if something becomes muddled.

* The unit of learning is a card. A card has a front and a back side. Generally the front will hold a question and the back the answer. In the case of vocabulary the front is in one language and the back is in another. 
* Any card is uniquely defined by the contents of the front and back side with order preserved, two cards with identical content are considered the same card. Note: For vocabulary-cards it makes sense to swap the front and back and learn them in the other direction, the system may support automatic creation of such cards, but they are separate cards.
* The system should start with immediately presenting a single card if it can. See below for how to select the next card. 
* The user can swipe a card in two directions to indicate whether they believe they know the answer or not. There are buttons below the card to allow the same operations by tapping. The buttons visually indicate the direction in which to swipe to achieve the same result. 
* A card can be tapped to turn it over presenting the other side this can be done repeatedly. Swipe-operations work the same on each side.
* Cards are organised in decks. A deck is identified by name. Examples for decks are a whole area of knowledge or the vocabulary for a single unit of a textbook. The deck-name should reflect that. 
* Decks can be added and removed. There should be import and export-functions to get them to and from a device in an easy way so they can be set up on a full computer.
* Decks present in the system can be made active and inactive. Cards from all active decks can be presented when learning/revising.
* There should be an import-function for decks from quizlet.com as there are loads of decks of cards there already. There must be a defined mapping from the quizlet data-model to the simplified front-and-back of Lernkartei.
* A card may be present in multiple decks but the learning-progress on it is only recorded once. As a card is identified by its contents, a global ID could be created by hashing that. If card-contents change it is considered a new card that has never been learned.
* The next card to present is selected from all cards in all active decks. The algorithm for how exactly to select the next card may take into account the times and status-values of previous presentations of the same card. There may be multiple algorithms to choose from.
* The learning-status of a single card, a whole deck or all active decks can be reset.
* On the main page presenting the cards there is a small statistics box displaying a summary of progress. There is a bar-graph representing all unique cards in all active decks with three sections: Not yet presented and marked as known or unknown on the last pass respectively.
* To support the ease of transport between different system for import of decks while also keeping some internal state like activation of decks and the learning-progress the data will likely be stored as a mix of flat files and relational content in a DB. This requires good keys.

## Technicalities

The project is being used to learn new technologies as a side-effect of producing a practical tool.

* The app is built as a hybrid webapp using Ionic2 
