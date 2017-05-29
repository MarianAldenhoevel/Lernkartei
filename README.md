# Lernkartei
A hybrid mobile app for studying using flashcards that concentrates on core features

## Motivation
I myself have used paper-based flashcards for memorizing the vocabulary of foreign languages in school and found that extremely effective and rewarding. Now my children are facing the same challenge and in the digital age the flash-cards should be presented on a computer or mobile phone of course.

This idea is not new a all of course. I looked at over a dozen flash-card apps on the android app-store and found them unsatisfactory for my own personal requirement. Man are infected by obnoxius advertising, some are very complex and claim to implement clever mnemonic algorithms, others are too simple again and do not track progress.

For any self-respecting software person this is a prompt to roll their own. Let's see wether I can do better.

## Import of card decks

The app can import data from local files. To do so on android it uses the cordova file-chooser plugin which integrates with the system and provides a native file selector. This allows seamless import from things like dropbox as well.

There are three basic formats currently supported: JSON, CSV and Excel (xlsx).

### JSON

The JSON format understood by this app is an array of objects, each having a front and back property. There is an optional id property if you want to identify cards yourself, if the id is missing it is automatically created from the front and back contents of the card by hashing.

Example:

```javascript
[
  { "front": "six times seven", "back": "42" },
  { "front": "two times two", "back": "4" }
]
```
### CSV

The CSV-import is implemented by [Papa Parse](http://papaparse.com/), see their page for detailled information on the options. Generally you will want to write a two-column CSV file with the front-content in column 1 and the back-content in column 2. If you want to include headers call them "front" and "back" and they will be skipped when importing data.

    "Front of first card", "back of first card"
    "Another card", "back of another card
    
### Excel XLSX

Spreadsheet-import is implemented by [js-xlxls](https://github.com/SheetJS/js-xlsx), see their page for details. Generally you will want to have two columns in your spreadsheet, the first one with the front-content of the cards, the second one with the backs.

## Collection of Ideas

This is a grab-bag of things that may make up a specification if worked on. This is a fun-project so there propably won't be such a thing but the list is here to reference if something becomes muddled.

* The unit of learning is a card. A card has a front and a back side. Generally the front will hold a question and the back the answer. In the case of vocabulary the front is in one language and the back is in another. 
* Any card is uniquely defined by the contents of the front and back side with order preserved, two cards with identical content are considered the same card. Note: For vocabulary-cards it makes sense to swap the front and back and learn them in the other direction, the system may support automatic creation of such cards, but they are separate cards.
* The system should start with immediately presenting a single card if it can. 
* The user can swipe a card in two directions to indicate whether they believe they know the answer or not. There are buttons below the card to allow the same operations by tapping. The buttons visually indicate the direction in which to swipe to achieve the same result. 
* A card can be tapped to turn it over presenting the other side this can be done repeatedly. Swipe-operations work the same on each side.
* Cards are organised in decks. A deck is identified by name. Examples for decks are a whole area of knowledge or the vocabulary for a single unit of a textbook. The deck-name should reflect that. 
* Decks can be added and removed. There should be import and export-functions to get them to and from a device in an easy way so they can be set up on a full computer.
* Decks present in the system can be made active and inactive. Cards from all active decks can be presented when learning/revising.
* The list of decks the system knows about can be filtered by substring without affecting the active/inactive status. This can be used to limit to decks from a certain area of knowledge while preserving the progress on others.
* There should be an import-function for decks from quizlet.com as there are loads of decks of cards there already. There must be a defined mapping from the quizlet data-model to the simplified front-and-back of Lernkartei.
* A card may be present in multiple decks but the learning-progress on it is only recorded once. As a card is identified by its contents, a global ID could be created by hashing that. If card-contents change it is considered a new card that has never been learned.
* The next card to present is selected from all cards in all active decks that match an optional filter string. This set is considered the current set.
* Cards from the current set are considererd to be in one of n (n>=2) boxes. Box 0 has cards that are new or unknown, when a card is presented and swiped right the box index increases up to n, if it is swiped left it is reset to 0 or decremented. This is a user-option.
* The next card to be presented is randomly picked from the box with the lowest index that has cards.
* The learning-status of a single card, a whole deck or all active decks can be reset.
* On the main page presenting the cards there is a small statistics box displaying a summary of progress. There is a bar-graph representing all cards of the active set in their respective box.
* More statistics like number of sessions, cards presented per session or trends on how they move between their boxes may be presented on a dedicated page.

## Technicalities

The project is being used to learn new technologies as a side-effect of producing a practical tool.

* The app is built as a hybrid webapp using Ionic2 
* In the browser platform we use WebSQL as backend. In real mobile apps we will want to use ionic-native-sqlite.
