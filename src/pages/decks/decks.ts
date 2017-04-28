import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ImportDeckPage } from '../import-deck/import-deck';

import { Deck } from '../../types/deck';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'page-decks',
  templateUrl: 'decks.html'
})

export class DecksPage {
  decks: Array<Deck>;

  constructor(public navCtrl: NavController, public dataProvider: DataProvider) {
    this.getDecks(null);
  }

  getDecks(filterStr) {
    this.dataProvider.loadDecks(filterStr).then((decks) => this.decks = decks);
  }

  filterDecks(searchbar) {
    let filterStr: string = searchbar.srcElement.value;
    this.getDecks(filterStr);
  }

  toggleDeck(event, deck: Deck) {
    this.dataProvider.toggleDeck(deck);
  }

  importDeck(event) {
     this.navCtrl.push(ImportDeckPage);
  }

}
