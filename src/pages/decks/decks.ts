import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Deck } from '../../types/deck';
import { DecksProvider } from '../../providers/decks';

@Component({
  selector: 'page-decks',
  templateUrl: 'decks.html'
})

export class DecksPage {
  decks: Array<Deck>

  constructor(public navCtrl: NavController, public decksProvider: DecksProvider) {
    decksProvider.load().then((decks) => this.decks = decks);
  }

  toggleActive(event, deck: Deck) {
    console.log(deck);
    deck.active = !deck.active;
  }

}
