import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Deck } from '../types/deck';

@Injectable()

export class DecksProvider {
  decks: Array<Deck>;

  constructor() {
    console.log('DecksProvider.constructor()');
    
    this.decks = null;
  }

  load() {
    console.log("DecksProvider.load()");

    if (this.decks) {
      return Promise.resolve(this.decks);
    } else {
      return new Promise(resolve => {
        this.decks = [
          { "name": "Cornelsen G21 A4 Introduction", "active": true, "count": 4},
          { "name": "Cornelsen G21 A4 Unit 1", "active": false, "count": 7},
          { "name": "Cornelsen G21 A4 Unit 2", "active": false, "count": 12},
          { "name": "Hauptstädte der Welt", "active": true, "count": 100}
        ];

        resolve(this.decks);
      })
    };
  } // of load()
  
} // of class Decks
