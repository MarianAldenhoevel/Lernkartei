import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { Deck, Card, CardPresentationMode, CardDowngradeMode } from '../types/types';
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
        "numberOfBoxes": 3,
        "cardPresentationMode": CardPresentationMode.FrontFirst,
        "cardDowngradeMode": CardDowngradeMode.OneBoxDown,
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

    private currentCardStackInBoxes: Array<Array<Card>>;

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

        this.db.loadSetting("settings").then((value) => { 
            console.log("SessionProvider.loadSettings() - loaded");
            Object.assign(this.settings, value);
        });
    }

    saveSettings(): void {
        console.log("SessionProvider.saveSettings()");

        this.db.updateSetting("settings", this.settings);
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
                this.db.loadAllDecks().then((decks) => {
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

        this.currentCardStackInBoxes = null;
    }

    getCurrentCardStack(): Promise<Array<Array<Card>>> {
        //console.log("SessionProvider.getCurrentCardStack()");

        if (this.currentCardStackInBoxes) {
            // Have current stack of cards, resolve to that.
            return Promise.resolve(this.currentCardStackInBoxes);
        } else {
            // Load stack of all cards in all decks filtered AND active
            return new Promise(resolve => {
                console.log("SessionProvider.getCurrentCardStack() - load");

                this.db.loadCurrentCardStack(this.deckFilter).then((currentCardStack) => {
                    // We want the cards to be sorted into boxes.
                    this.currentCardStackInBoxes = [];
                    for (let box: number = 0; box < this.settings.numberOfBoxes; box++) {                        
                        this.currentCardStackInBoxes[box] = [];
                    }

                    for (var card of currentCardStack) {
                        // Clamp value of the current box between 0 and the high box index                        
                        let box = card.current_box;
                        if (!box) {
                            box = 0;
                        } else if (box >= this.settings.numberOfBoxes) {
                            box = this.settings.numberOfBoxes - 1;
                        }

                        this.currentCardStackInBoxes[box].push(card);                        
                    }

                    console.log("SessionProvider.getCurrentCardStack() - boxes: " + this.logStack(this.currentCardStackInBoxes));

                    resolve(this.currentCardStackInBoxes);
                })
            })
        }
    }

    logStack(stackInBoxes: Array<Array<Card>>) {
        // console.log("SessionProvider.logStack()");

        let msg: string = "[";
        for (let box: number = 0; box < this.settings.numberOfBoxes; box++) {                        
            if (box > 0) { msg += ", "; }
            msg += stackInBoxes[box].length;
        }
        msg += "]";

        return msg;
    }

    toggleDeck(deck: Deck) {
        console.log("SessionProvider.toggleDeck(\"" + deck.name + "\")");

        deck.active = !deck.active;
        this.db.updateDeck(deck);
        this.invalidateCurrentCardStack();
    }

    deleteDeck(deck: Deck) {
        console.log("SessionProvider.deleteDeck(\"" + deck.name + "\")");

        this.db.deleteDeck(deck);
        this.invalidateCurrentCardStack();
        this.allDecks = this.allDecks.filter((_deck) => _deck.id !== deck.id);
        this.filteredDecks = this.filteredDecks.filter((_deck) => _deck.id !== deck.id);
    }

    getNextCard(): Promise<Card> {
        console.log("SessionProvider.getNextCard()");
        
        return this.getCurrentCardStack().then((deck) => { 
            // Find box with the lowest index that has cards in it.
            for(let box: number = 0; box < this.settings.numberOfBoxes; box++) {
                if (deck[box].length) {
                    // return a random card from this box.
                    return deck[box][Math.floor(Math.random() * deck[box].length)]    
                }
            }

            // No card found at all.
            return null;
        } );
    }

    recordOutcome(card: Card, known: boolean) {
        console.log("SessionProvider.recordOutcome(" + card.id + "," + (known ? "known" : "unknown") + ")");

        this.getCurrentCardStack().then((deck) => {             
            // Remove card from the current box on the current stack.
            card.current_box = card.current_box ? card.current_box : 0;
            this.currentCardStackInBoxes[card.current_box] = this.currentCardStackInBoxes[card.current_box].filter((_card) => _card.id !== card.id);
        
            // Modify card.
            if (known && (card.current_box < this.settings.numberOfBoxes)) {
                card.current_box++;
            } else if (!known && (this.settings.cardDowngradeMode == CardDowngradeMode.ToFirstBox)) {
                card.current_box = 0;
            } else if (!known && (this.settings.cardDowngradeMode == CardDowngradeMode.OneBoxDown) && (card.current_box > 0)) {
                card.current_box--;
            }

            // Put card in the new box.
            this.currentCardStackInBoxes[card.current_box].push(card);

            console.log("SessionProvider.recordOutcome(" + card.id + "," + (known ? "known" : "unknown") + ") - boxes: " + this.logStack(this.currentCardStackInBoxes));

            // Update DB to persist the card status
            this.db.updateCard(card);        
        });
    }

} // of class
