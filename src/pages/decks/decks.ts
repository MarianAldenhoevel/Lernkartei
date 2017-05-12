import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { ImportDeckPage } from '../import-deck/import-deck';

import { Deck } from '../../types/types';
import { SessionProvider } from '../../providers/session';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
    selector: 'page-decks',
    templateUrl: 'decks.html'
})
export class DecksPage {
    decks: Array<Deck>;

    constructor(
        public navCtrl: NavController, 
        private alertCtrl: AlertController,
        public session: SessionProvider,
        public translate: TranslateService
    ) {
        this.getDecks();
    }

    getDecks() {
        // console.log("DecksPage.getDecks()");

        this.session.getFilteredDecks().then((decks) => { this.decks = decks; });
    }

    filterDecks(searchbar) {
        let deckFilter: string = searchbar.srcElement.value;
        // console.log("DecksPage.filterDecks(\"" + deckFilter + "\")");

        this.session.setDeckFilter(deckFilter);
        this.getDecks();
    }

    toggleDeck(event, deck: Deck) {
        // console.log("DecksPage.toggleDeck(\"" + deck.name + "\")");

        this.session.toggleDeck(deck);
    }

    deleteDeck(event, deck: Deck) {
        // console.log("DecksPage.deleteDeck(\"" + deck.name + "\")");

        let confirm = this.alertCtrl.create({
            "title": this.translate.instant("CONFIRM"),
            "message": this.translate.instant("CONFIRM_DELETE_DECK"),
            "buttons": [
                {
                    text: this.translate.instant("NO"),
                    role: 'cancel',
                    handler: () => {
                        // console.log("DecksPage.deleteDeck() - cancelled");    
                    }
                },
                {
                    text: this.translate.instant("YES"),
                    handler: () => {
                        // console.log("DecksPage.deleteDeck() - confirmed");

                        this.session.deleteDeck(deck);   
                        this.decks = this.decks.filter((_deck) => (deck.id !== _deck.id));                
                    }
                }
            ]
        });

        confirm.present();
    }

    importDeck(event) {
        // console.log("DecksPage.importDeck()");

        this.navCtrl.push(ImportDeckPage);
    }

}
