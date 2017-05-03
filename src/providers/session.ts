import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { Deck, Card, CardPresentationMode, Outcome } from '../types/types';
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

    public settings = {
        "animateCard": true,
        "cardPresentationMode": CardPresentationMode.FrontFirst,
        "background": "#eeeeee",
        "card": {
            "front": {
                "backgroundColor": "#ffffff",
                "color": "#000000"
                },
            "back": {
                "backgroundColor": "#dddddd",
                "color": "#000000"
            }
        }
    };

    private allDecks: Array<Deck>;
    private filteredDecks: Array<Deck>;

    private currentCardStack: Array<Card>;

    constructor(public device: Device, public db: DBProvider, private _appVersion: AppVersion) {
        console.log('SessionProvider.constructor()');

        this.allDecks = null;
        this.filteredDecks = null;

        // Fulfill the promises on AppVersion by assigning to local properties
        _appVersion.getAppName().then((s) => { this.appVersion.appName = s }).catch((err) => { });
        _appVersion.getPackageName().then((s) => { this.appVersion.packageName = s }).catch((err) => { });
        _appVersion.getVersionCode().then((s) => { this.appVersion.versionCode = s }).catch((err) => { });
        _appVersion.getVersionNumber().then((s) => { this.appVersion.versionNumber = s }).catch((err) => { });
    }

    loadSettings(): void {
        console.log("SessionProvider.loadSettings()");
    }

    saveSettings(): void {
        console.log("SessionProvider.saveSettings()");
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
                this.getAllDecks().then((allDecks) => {
                    if (!this.deckFilter) {
                        // No filtering requested.
                        this.filteredDecks = allDecks;
                    } else {
                        // Apply filter to complete set, and store result 
                        this.filteredDecks = allDecks.filter((deck: Deck) => { return deck.name.toUpperCase().indexOf(this.deckFilter.toUpperCase()) != -1 });
                    }

                    resolve(this.filteredDecks);
                })
            })
        }
    }

    invalidateCurrentCardStack(): void {
        console.log("SessionProvider.invalidateCurrentCardStack()");

        this.currentCardStack = null;
    }

    getCurrentCardStack(): Promise<Array<Card>> {
        console.log("SessionProvider.getCurrentCardStack()");

        if (this.currentCardStack) {
            // Have current stack of cards, resolve to that.
            return Promise.resolve(this.currentCardStack);
        } else {
            // Load stack of all cards in all decks filtered AND active
            return new Promise(resolve => {
                this.db.getCurrentCardStack(this.deckFilter).then((currentCardStack) => {
                    this.currentCardStack = currentCardStack;
                    resolve(this.currentCardStack);
                })
            })
        }
    }

    toggleDeck(deck: Deck) {
        console.log("SessionProvider.toggleDeck(\"" + deck.name + "\")");

        deck.active = !deck.active;
    }

    getNextCard(): Promise<Card> {
        console.log("SessionProvider.getNextCard()");
        return this.db.getNextCard();
    }

    recordOutcome(card: Card, outcome: Outcome) {
        console.log("SessionProvider.recordOutcome()");
    }

} // of class
