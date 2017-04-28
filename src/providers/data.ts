import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { Deck } from '../types/deck';

@Injectable()

export class DataProvider {
  decks: Array<Deck>;
  appVersion = {
    "appName": null,
    "packageName": null,
    "versionCode": null,
    "versionNumber": null  
  };

  constructor(public device: Device, private _appVersion: AppVersion) {
    console.log('DataProvider.constructor()');
    
    // Initialize array of available decks to null, it will be populated
    // once in the first call to loadDecks() and then maintained internally. 
    this.decks = null;

    // Fulfill the promises on AppVersion by assigning to local properties
    _appVersion.getAppName().then((s) => { this.appVersion.appName = s }).catch((err) => {});
    _appVersion.getPackageName().then((s) => { this.appVersion.packageName = s }).catch((err) => {});
    _appVersion.getVersionCode().then((s) => { this.appVersion.versionCode = s }).catch((err) => {});
    _appVersion.getVersionNumber().then((s) => { this.appVersion.versionNumber = s }).catch((err) => {});
  }

  filterDecks(filterStr: string): Array<Deck> {
    // console.log("DataProvider.filterDecks(\"" + (filterStr || "") + "\")");
    
    if (!filterStr) {
      // unfiltered
      return this.decks;
    } else {
      // filter by substring, case-insensitive
      return this.decks.filter((deck: Deck) => { return deck.name.toUpperCase().indexOf(filterStr.toUpperCase()) != -1 } )
    }
  }

  loadDecks(filterStr: string) {
    // console.log("DataProvider.loadDecks(\"" + (filterStr || "") + "\")");
    
    if (this.decks) {
      return Promise.resolve(this.filterDecks(filterStr));
    } else {
      return new Promise(resolve => {
        // Mock-up, just set a constant array.
        this.decks = [
          { "name": "Cornelsen G21 A4 Introduction", "active": false, "count":   4},
          { "name": "Cornelsen G21 A4 Unit 1",       "active": false, "count":   7},
          { "name": "Cornelsen G21 A4 Unit 2",       "active": false, "count":  12},
          { "name": "Hauptstädte der Welt",          "active": false, "count": 100}
        ];
        
        resolve(this.filterDecks(filterStr));
      })
    };
  } // of load()
  
  toggleDeck(deck: Deck) {
    console.log("DataProvider.toggleDeck(\"" + deck.name + "\")");
    
    deck.active = !deck.active;
  }

} // of class
