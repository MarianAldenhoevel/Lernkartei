import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { Deck, Card, Box, CardPresentationMode, CardDowngradeMode, Session, SessionInfo } from '../types/types';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { DBProvider } from './db';
import { ToolsProvider } from './tools';

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

    private currentCardStackInBoxes: Array<Box>;
    private startingBox: number = null;

    public currentSession: Session = {
        "started": null,
        "finished": null,
        "stack_size": 0,
        "cards_known": 0,
        "cards_unknown": 0
    }

    constructor(
        public device: Device,
        public db: DBProvider,
        public tools: ToolsProvider,
        public translate: TranslateService,
        private _appVersion: AppVersion) {
        // console.log('SessionProvider.constructor()');

        this.allDecks = null;
        this.filteredDecks = null;

        // Fulfill the promises on AppVersion by assigning to local properties
        _appVersion.getAppName().then(s => { this.appVersion.appName = s }).catch(err => { });
        _appVersion.getPackageName().then(s => { this.appVersion.packageName = s }).catch(err => { });
        _appVersion.getVersionCode().then(s => { this.appVersion.versionCode = s }).catch(err => { });
        _appVersion.getVersionNumber().then(s => { this.appVersion.versionNumber = s }).catch(err => { });
    }

    loadSettingsObject(): void {
        // console.log("SessionProvider.loadSettingsObject()");

        this.db.loadSetting("settingsObject").then(value => {
            // console.log("SessionProvider.loadSettingsObject() - loaded");
            Object.assign(this.settings, value);
        });
    }

    saveSettingsObject(): void {
        // console.log("SessionProvider.saveSettingsObject()");

        this.db.updateSetting("settingsObject", this.settings);
    }

    setDeckFilter(deckFilter: string) {
        // console.log("SessionProvider.setDeckFilter(\"" + (deckFilter || "") + "\")");

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
        // console.log("SessionProvider.getAllDecks()");

        if (this.allDecks) {
            // Have complete set. Resolve to that.
            return Promise.resolve(this.allDecks);
        } else {
            // Instruct DB to load the complete set, store locally and resolve to it.
            return new Promise(resolve => {
                this.db.loadAllDecks().then(decks => {
                    this.allDecks = decks;
                    resolve(this.allDecks)
                });
            })
        };
    }

    getFilteredDecks(): Promise<Array<Deck>> {
        // console.log("SessionProvider.getFilteredDecks()");

        if (this.filteredDecks) {
            // Have current filtered set, resolve to that.
            return Promise.resolve(this.filteredDecks);
        } else {
            // Create new filtered set and resolve to it.
            return new Promise(resolve => {
                this.getAllDecks().then(allDecks => {
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
        // console.log("SessionProvider.invalidateCurrentCardStack()");

        this.currentCardStackInBoxes = null;
        this.startingBox = null;
    }

    getCurrentCardStack(): Promise<Array<Box>> {
        //console.log("SessionProvider.getCurrentCardStack()");

        if (this.currentCardStackInBoxes) {
            // Have current stack of cards, resolve to that.
            return Promise.resolve(this.currentCardStackInBoxes);
        } else {
            // Load stack of all cards in all decks filtered AND active
            return new Promise(resolve => {
                // console.log("SessionProvider.getCurrentCardStack() - load");

                this.db.loadCurrentCardStack(this.deckFilter).then(currentCardStack => {
                    // We want the cards to be sorted into boxes.
                    this.currentCardStackInBoxes = [];
                    for (let box: number = 0; box < this.settings.numberOfBoxes; box++) {
                        this.currentCardStackInBoxes[box] = { presented: [], unpresented: [] };
                    }

                    this.currentSession.stack_size = currentCardStack.length;
                    
                    for (var card of currentCardStack) {
                        // Clamp value of the current box between 0 and the high box index                        
                        if (!card.current_box) {
                            card.current_box = 0;
                        } else if (card.current_box >= this.currentCardStackInBoxes.length) {
                            card.current_box = this.currentCardStackInBoxes.length - 1;
                        }

                        // Put the card in the right box on the current stack structure. 
                        this.currentCardStackInBoxes[card.current_box].unpresented.push(card);
                    }

                    // console.log("SessionProvider.getCurrentCardStack() - boxes: " + this.logStack(this.currentCardStackInBoxes));

                    this.startingBox = this.lowestBoxWithUnpresentedCards();                    

                    resolve(this.currentCardStackInBoxes);
                })
            })
        }
    }

    logStack(stackInBoxes: Array<Box>) {
        // console.log("SessionProvider.logStack()");

        let msg: string = "[";
        for (let box: number = 0; box < this.settings.numberOfBoxes; box++) {
            if (box > 0) { msg += ", "; }
            msg += "<" + stackInBoxes[box].unpresented.length + "/" + stackInBoxes[box].presented.length + ">";
        }
        msg += "]";

        return msg;
    }

    resetDeck(deck: Deck) {
        // console.log("SessionProvider.resetDeck(\"" + deck.name + "\")");

        this.db.resetDeck(deck);
        this.invalidateCurrentCardStack();
    }

    renameDeck(deck: Deck, name: string) {
        // console.log("SessionProvider.renameDeck(\"" + deck.name + "\",\"" + name + "\)");

        if (deck.name != name) {
            deck.name = name;
            this.db.updateDeck(deck);
            this.invalidateCurrentCardStack();
        }
    }

    toggleDeck(deck: Deck) {
        // console.log("SessionProvider.toggleDeck(\"" + deck.name + "\")");

        deck.active = !deck.active;
        
        this.db.updateDeck(deck).then(() => {
            this.invalidateCurrentCardStack();
        })
    }

    deleteDeck(deck: Deck) {
        // console.log("SessionProvider.deleteDeck(\"" + deck.name + "\")");

        this.db.deleteDeck(deck);
        this.invalidateCurrentCardStack();
        this.allDecks = this.allDecks.filter(_deck => { _deck.id !== deck.id; });
        this.filteredDecks = this.filteredDecks.filter(_deck => { _deck.id !== deck.id; });
    }

    startSession() {
        // console.log("SessionProvider.startSession()");

        this.currentSession.started = new Date();
        this.currentSession.finished = null;
        this.currentSession.cards_known = 0;
        this.currentSession.cards_unknown = 0;
    }

    saveSession() {
        // console.log("SessionProvider.saveSession()");
        this.db.updateSession(this.currentSession).then(() => { this.currentSession.started = null; });
    }

    getRecentSessions(): Promise<Array<Session>> {
        // console.log("SessionProvider.getRecentSessions()");

        return this.db.loadRecentSessions().then((sessionrows) => {
            let result: Array<SessionInfo> = [];

            for (let i: number = 0; i < sessionrows.length; i++) {
                result.push({
                    "ago": this.translate.instant("AGO_PRE") + this.tools.intervalToStr(new Date(sessionrows[i].started), new Date()) + this.translate.instant("AGO_POST"),
                    "duration": this.translate.instant("FOR_PRE") + this.tools.intervalToStr(new Date(sessionrows[i].started), new Date(sessionrows[i].finished)) + this.translate.instant("FOR_POST"),
                    "stack_size": sessionrows[i].stack_size,
                    "cards_known": sessionrows[i].cards_known,
                    "cards_unknown": sessionrows[i].cards_unknown
                });
            };

            return result;
        });
    }

    getNextCard(): Promise<Card> {
        // console.log("SessionProvider.getNextCard()");

        return this.getCurrentCardStack().then((deck) => {
            // Find box with the lowest index that has cards in it.
            for (let box: number = (this.startingBox || 0); box < deck.length; box++) {
                // console.log("SessionProvider.getNextCard() - checking box " + box);

                if (deck[box].unpresented.length) {
                    // return a random card from this box.
                    // console.log("SessionProvider.getNextCard() - picking from box " + box);

                    return deck[box].unpresented[Math.floor(Math.random() * deck[box].unpresented.length)];
                }
            }

            // No card found at all.
            return null;
        });
    }

    countCards(): number {
        // console.log("SessionProvider.countCards()");

        let result = 0;

        if (this.currentCardStackInBoxes) {
            for (let box: number = 0; box < this.currentCardStackInBoxes.length; box++) {
                result = result
                    + this.currentCardStackInBoxes[box].unpresented.length
                    + this.currentCardStackInBoxes[box].presented.length;
            }
        }

        return result;
    }

    hasCards(): boolean {
        // console.log("SessionProvider.hasCards()");

        if (this.currentCardStackInBoxes) {
            for (let box: number = 0; box < this.currentCardStackInBoxes.length; box++) {
                if (this.currentCardStackInBoxes[box].unpresented.length || this.currentCardStackInBoxes[box].presented.length) {
                    // console.log("SessionProvider.hasCards() - true");
                    return true;
                }
            }
            // console.log("SessionProvider.hasCards() - false (loaded)");
            return false;
        } else {
            // console.log("SessionProvider.hasCards() - false (not loaded");
            return false;
        }
    }

    // Return the index of the lowest box that has unpresented cards. 
    lowestBoxWithUnpresentedCards(): number {
        // console.log("SessionProvider.lowestBoxWithUnpresentedCards()");
        for (let box: number = 0; box < this.currentCardStackInBoxes.length; box++) {
            if (this.currentCardStackInBoxes[box].unpresented.length) {
                return box;
            }
        }

        return 0;
    }

    recordOutcome(card: Card, known: boolean) {
        // console.log("SessionProvider.recordOutcome(" + card.id + "," + (known ? "known" : "unknown") + ")");

        this.getCurrentCardStack().then((deck) => {
            // Remove card from the current box on the current stack.
            let old_box: number = card.current_box ? card.current_box : 0;

            this.currentCardStackInBoxes[old_box].unpresented = this.currentCardStackInBoxes[old_box].unpresented.filter((_card) => _card.id !== card.id);
            this.currentCardStackInBoxes[old_box].presented = this.currentCardStackInBoxes[old_box].presented.filter((_card) => _card.id !== card.id);

            // If this was the last card from our starting box for the current training
            // session reset the starting box to the now lowest that has unpresented cards. .
            if ((this.startingBox <= old_box) && (this.currentCardStackInBoxes[old_box].unpresented.length == 0)) {
                this.startingBox = this.lowestBoxWithUnpresentedCards();
            }

            // Modify card.
            if (known && (card.current_box < this.currentCardStackInBoxes.length - 1)) {
                card.current_box = card.current_box + 1;
            } else if (!known && (this.settings.cardDowngradeMode == CardDowngradeMode.ToFirstBox)) {
                card.current_box = 0;
            } else if (!known && (this.settings.cardDowngradeMode == CardDowngradeMode.OneBoxDown) && (card.current_box > 0)) {
                card.current_box = card.current_box - 1;
            }

            // Put card in the new box. If it goes to the same box (known in the last box or unknown in
            // the first box) put it into the presented section, otherwise treat as unpresented.
            if ((card.current_box == old_box) || (card.current_box == this.currentCardStackInBoxes.length - 1)) {
                this.currentCardStackInBoxes[card.current_box].presented.push(card);
            } else {
                this.currentCardStackInBoxes[card.current_box].unpresented.push(card);
            }

            // Update DB to persist the card status.
            this.db.updateCard(card);

            // Update the running session totals.            
            if (known) {
                this.currentSession.cards_known = this.currentSession.cards_known + 1;
            } else {
                this.currentSession.cards_unknown = this.currentSession.cards_unknown + 1;
            }

        });
    }

    importDeck(uri: string): Promise<any> {
        return this.db.openDeckFromUri(uri)
            .then(deckinfo => this.db.importDeck(deckinfo))
            .then(() => {
                this.filteredDecks = null;
                this.allDecks = null;
            })
            .catch(e => {
                console.log(e);
                throw e;
            });
    }

} // of class
