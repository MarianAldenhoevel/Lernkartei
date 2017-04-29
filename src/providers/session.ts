import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { Deck } from '../types/deck';
import { DBProvider } from './db';

@Injectable()

export class SessionProvider {
    public deckFilter: string = null;
    public appVersion = {
        "appName": null,
        "packageName": null,
        "versionCode": null,
        "versionNumber": null
    };

    private allDecks: Array<Deck>;
    private filteredDecks: Array<Deck>;

    constructor(public device: Device, public db: DBProvider, private _appVersion: AppVersion) {
        console.log('SessionProvider.constructor()');

        this.allDecks = null;
        this.filteredDecks = null;

        // Fulfill the promises on AppVersion by assigning to local properties
        _appVersion.getAppName().then((s) =>       { this.appVersion.appName = s       }).catch((err) => { });
        _appVersion.getPackageName().then((s) =>   { this.appVersion.packageName = s   }).catch((err) => { });
        _appVersion.getVersionCode().then((s) =>   { this.appVersion.versionCode = s   }).catch((err) => { });
        _appVersion.getVersionNumber().then((s) => { this.appVersion.versionNumber = s }).catch((err) => { });
    }

    setDeckFilter(deckFilter: string) {
        console.log("SessionProvider.setDeckFilter(\"" + (deckFilter || "") + "\")");

        if (deckFilter != this.deckFilter) {
            // Filter has changed, invalidate filtered set.
            this.deckFilter = deckFilter;
            this.filteredDecks = null;
        }
    }

    getDeckFilter() {
        return this.deckFilter;
    }

    getAllDecks(): Promise<Array<Deck>> {
        console.log("SessionProvider.getAllDecks()");

        if (this.allDecks) {
            // Have complete set. Resolve to that.
            return Promise.resolve(this.allDecks);
        } else {
            // Instruct DB to load the complete set, store locally and resolve to it.
            return new Promise(resolve => {
                this.db.getAllDecks().then((decks) => { 
                    this.allDecks = decks; 
                    resolve(this.allDecks) 
                });
            })
        };
    }

    getFilteredDecks(): Promise<Array<Deck>> {
        console.log("SessionProvider.getFilteredDecks()");

        if (this.filteredDecks) {
            // Have current filtered set, resolve to that.
            return Promise.resolve(this.filteredDecks);
        } else {
            // Create new filtered set and resolve to it.
            return new Promise(resolve => {
                this.getAllDecks().then((alldecks) => {     
                    if (!this.deckFilter) {
                        // No filtering requested.
                        this.filteredDecks = alldecks;
                    } else {
                        // Apply filter to complete set, and store result 
                        this.filteredDecks = alldecks.filter((deck: Deck) => { return deck.name.toUpperCase().indexOf(this.deckFilter.toUpperCase()) != -1 }); 
                    }
                
                    resolve(this.filteredDecks);
                })
            })
        }
    }

    toggleDeck(deck: Deck) {
        console.log("SessionProvider.toggleDeck(\"" + deck.name + "\")");

        deck.active = !deck.active;
    }

} // of class
