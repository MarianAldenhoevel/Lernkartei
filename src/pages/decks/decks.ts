import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ImportDeckPage } from '../import-deck/import-deck';

import { Deck } from '../../types/deck';
import { SessionProvider } from '../../providers/session';

@Component({
    selector: 'page-decks',
    templateUrl: 'decks.html'
})

export class DecksPage {
    decks: Array<Deck>;

    constructor(public navCtrl: NavController, public session: SessionProvider) {
        this.getDecks();
    }

    getDecks() {
        console.log("DecksPage.getDecks()");

        this.session.getFilteredDecks().then((decks) => { this.decks = decks; });
    }

    filterDecks(searchbar) {
        let deckFilter: string = searchbar.srcElement.value;
        console.log("DecksPage.filterDecks(\"" + deckFilter + "\")");

        this.session.setDeckFilter(deckFilter);
        this.getDecks();
    }

    toggleDeck(event, deck: Deck) {
        console.log("DecksPage.toggleDeck(\"" + deck.name + "\")");
        
        this.session.toggleDeck(deck);
    }

    importDeck(event) {
        console.log("DecksPage.importDeck()");

        this.navCtrl.push(ImportDeckPage);
    }

}
