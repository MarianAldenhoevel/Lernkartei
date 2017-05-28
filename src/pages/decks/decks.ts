import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from "@ionic-native/device";

import { FileChooser } from '@ionic-native/file-chooser';

import { Deck } from '../../types/types';
import { SessionProvider } from '../../providers/session';
import { LoadingProvider } from '../../providers/loading';
import { ConfirmProvider } from '../../providers/confirm';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
    selector: 'page-decks',
    templateUrl: 'decks.html'
})
export class DecksPage {
    decks: Array<Deck>;

    constructor(
        public navCtrl: NavController,
        private confirm: ConfirmProvider,
        private loading: LoadingProvider,
        public session: SessionProvider,
        public translate: TranslateService,
        public fileChooser: FileChooser,
        private device: Device
    ) {
        this.getDecks();
    }

    getDecks(): Promise<Array<Deck>> {
        // console.log("DecksPage.getDecks()");

        return this.session.getFilteredDecks()
            .then(decks => { this.decks = decks; return decks; });
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

    resetDeck(event, deck: Deck) {
        // console.log("DecksPage.resetDeck(\"" + deck.name + "\")");

        this.confirm.yesNo(this.translate.instant("CONFIRM_RESET_DECK")).then(confirmed => {
            if (confirmed) {
                this.session.resetDeck(deck);
            }
        });
    }

    renameDeck(event, deck: Deck) {
        // console.log("DecksPage.renameDeck(\"" + deck.name + "\")");

        this.confirm.prompt(
            this.translate.instant("RENAME_DECK_TITLE"),
            this.translate.instant("RENAME_DECK_PROMPT"),
            deck.name).then(result => {
                this.session.renameDeck(deck, result);
            }).catch((reason) => { /* dialog cancelled */ } );
    };

    deleteDeck(event, deck: Deck) {
        // console.log("DecksPage.deleteDeck(\"" + deck.name + "\")");

        this.confirm.yesNo(this.translate.instant("CONFIRM_DELETE_DECK")).then(confirmed => {
            if (confirmed) {
                this.session.deleteDeck(deck);
                this.decks = this.decks.filter(_deck => { 
                    return (deck.id !==_deck.id); 
                });
            }
        });
    }

    importDeckFromFile(event) {
        console.log("DecksPage.importDeckFromFile()");

        this.loading.show();

        this.fileChooser.open()
            .then(uri => {
                console.log("DecksPage.importDeckFromFile() - \"" + uri + "\"");
                return this.session.importDeck(uri);
            }).then(() => { return this.getDecks(); })
            .then(() => { this.loading.hide(); })
            .catch(err => {
                this.loading.hide();
                this.confirm.error(this.translate.instant("ERROR_IMPORTING_DECK") + "\n\n" + (err.message || err));
            })
    }


}
