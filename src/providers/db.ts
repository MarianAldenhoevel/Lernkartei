import { Injectable } from "@angular/core";

import { Device } from "@ionic-native/device";
import { SQLite } from "@ionic-native/sqlite";

import * as jQuery from "jquery";

import { Deck, Card } from "../types/types";

@Injectable()
export class DBProvider {

    private db = null;

    constructor(private device: Device, private sqlite: SQLite) {
        console.log("DBProvider.constructor()");
    }

    useWebSQL(): boolean {
        // return !this.device.cordova || (this.device.platform == "core");
        return true;
    }

    // Resolves to a SLQResult interface.
    runSQL(sql: string, params?: Array<any>): Promise<any> {
        // console.log("DBProvider.runSQL(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "]");

        if (this.useWebSQL()) {
            let ops = new Promise<any>(resolve => {
                // console.log("DBProvider.runSQL(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - transaction()"); 

                this.db.transaction(
                    (tx) => {
                        // console.log("DBProvider.runSQL(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - executeSql()"); 

                        tx.executeSql(sql, (params ? params : []), (tx, result) => {
                            // console.log("DBProvider.runSQL(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - resolving executeSql result"); 

                            resolve(result);
                            tx = null;
                        }, (tx, error) => {
                            console.error(error.message + "\nSQL:\n" + sql + "\nParams: [" + (params ? params.join(", ") : "") + "]");
                            throw error;
                        });
                    }
                    , (error) => { throw error; }
                    // , () => { console.log("DBProvider.runSQL(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - Transaction completed"); }
                )
            });

            return ops;
        } else {
            throw new Error("runSQL() not implemented for SQLite");
        }
    }

    // Resolves to undefined.
    runDDL(sql: string, params?: Array<any>): Promise<void> {
        // console.log("DBProvider.runDDL()");

        let ops = this.runSQL(sql, params);
        ops = ops.then((result) => { return; });
        return ops;
    }

    // Resolves to the number of records affected.
    runDML(sql: string, params?: Array<any>): Promise<number> {
        // console.log("DBProvider.runDML()");

        let ops = this.runSQL(sql, params);
        ops = ops.then((result) => { return result.rowsAffected; });
        return ops;
    }

    // Resolves to the last inserted ID.
    runINSERT(sql: string, params?: Array<any>): Promise<number> {
        // console.log("DBProvider.runDML()");

        let ops = this.runSQL(sql, params);
        ops = ops.then((result) => { return result.insertId; });
        return ops;
    }

    // Resolves to an array of objects representing the result set.
    runSELECT(sql: string, params?: Array<any>): Promise<Array<any>> {
        // console.log("DBProvider.runSELECT()");

        let ops = this.runSQL(sql, params);
        ops = ops.then((result) => {
            let rows = [];
            for (let i: number = 0; i < result.rows.length; i++) {
                let row = result.rows.item(i);
                rows.push(row);
            };

            return rows;
        });

        return ops;
    }

    readWebFile(url: string): Promise<any> {
        console.log("DBProvider.readWebFile(\"" + url + "\")");

        return new Promise<any>(resolve => {
            jQuery.ajax({
                "url": url,
                "dataType": "text"
            }).done((data) => {
                console.log("DBProvider.readWebFile(\"" + url + "\") - read success (" + data.length + " characters).");

                let basename: string = url.split("/").pop().split("#")[0].split("?")[0];
                let i: number = basename.lastIndexOf(".");
                if (i !== -1) {
                    basename = basename.substring(0, i);
                }

                resolve({ "name": basename, "data": data });
            });
        });
    }

    importDeck(deckinfo: any): Promise<void> {
        console.log("DBProvider.importDeck()");

        let deckId: number;

        let ops: Promise<any> = this.runDML("INSERT INTO DECKS (name, active) VALUES (?,?)", [deckinfo.name, 1]);
        ops = ops.then((insertId: number) => {
            console.log("Deck inserted with id " + insertId.toString());
            deckId = insertId;
        });

        // TODO: Find out what format the data is in and parse/interpret accordingly.
        // Assume the data is in form of a JSON-encoded array.
        let data = JSON.parse(deckinfo.data);
        for (let i: number = 0; i < data.length; i++) {
            ops = ops.then(() => this.runINSERT("INSERT INTO CARDS (id, front, back) VALUES (?,?,?)", [data[i].id, data[i].front, data[i].back]));
            ops = ops.then(() => this.runINSERT("INSERT INTO DECK_CARDS (deck_id, card_id) VALUES (?,?)", [deckId, data[i].id]));
        }

        return ops;
    }

    initDB(): Promise<void> {
        console.log("DBProvider.initDB()");

        let ops = this.runDDL("CREATE TABLE IF NOT EXISTS DECKS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, active INTEGER)");
        ops = ops.then(() => this.runDDL("CREATE TABLE IF NOT EXISTS CARDS (id TEXT PRIMARY KEY, front TEXT, back TEXT)"));
        ops = ops.then(() => this.runDDL("CREATE TABLE IF NOT EXISTS DECK_CARDS (deck_id INTEGER, card_id TEXT, CONSTRAINT unq_deck_card UNIQUE (deck_id, card_id))"));
        ops = ops.then(() => this.runDDL("CREATE TABLE IF NOT EXISTS SETTINGS (name TEXT PRIMARY KEY, value TEXT)"));
        
        ops = ops.then(() => this.readWebFile("assets/decks/Einmaleins.json"));
        ops = ops.then((content) => this.importDeck(content));
        
        ops = ops.then(() => this.readWebFile("assets/decks/Hauptstädte der Welt.json"));
        ops = ops.then((content) => this.importDeck(content));

        return ops;
    }

    dropDB(): Promise<void> {
        console.log("DBProvider.dropDB()");

        if (this.useWebSQL()) {
            // There is no support for enumerating or dropping databases in WebSQL.
            // So we simply drop all the tables.
            let ops: Promise<void> = this.runDDL("DROP TABLE IF EXISTS DECK_CARDS");
            ops = ops.then(() => this.runDDL("DROP TABLE IF EXISTS CARDS"));
            ops = ops.then(() => this.runDDL("DROP TABLE IF EXISTS DECKS"));
            ops = ops.then(() => this.runDDL("DROP TABLE IF EXISTS SETTINGS"));

            return ops;
        } else {
            throw new Error("dropDB() not implemented for SQLite");
        };
    }

    openDB(): Promise<void> {
        // console.log("DBProvider.openDB()");

        if (this.db) {
            return Promise.resolve(this.db);
        } else {
            let ops: Promise<any> = new Promise<void>(resolve => {
                console.log("DBProvider.openDB()");
                resolve();
            });

            // Open/create DB, switch on device.platform so browser-development
            // uses WebSQL and production uses SQLite.
            if (this.useWebSQL()) {
                ops = ops.then(() => {
                    console.log("DBProvider.openDB() - open using WebSQL");
                    return window["openDatabase"]("lernkartei.db", "1.0", "Lernkartei", 5 * 1024 * 1024);
                });
            } else {
                ops = ops.then(() => {
                    return new Promise<any>(resolve => {
                        console.log("DBProvider.openDB() - open using SQLite");
                        resolve(this.sqlite.create({ name: 'lernkartei.db', location: 'default' }));
                    })
                })
            };
            ops = ops.then((db) => {
                // console.log("DBProvider.openDB() - checking wether to initially populate DB");
                this.db = db;
                return this.runSELECT("SELECT name FROM sqlite_master WHERE type='table' AND name='DECKS';");
            });
            ops = ops.then((rows) => {
                if (rows.length == 0) {
                    // console.log("DBProvider.openDB() - Yes, need to initially populate DB");
                    return this.initDB();
                } else {
                    // console.log("DBProvider.openDB() - No, table DECKS exists, we assume structure is OK.");
                    return ([]);
                }
            });
            ops = ops.then((data) => {
                console.log("DBProvider.openDB() - done.");
                return this.db;
            });

            return ops;
        }
    }

    getSetting(key: string): Promise<any> {
        console.log("DBProvider.getSetting(\"" + key + "\")");

        return this.openDB()
            .then((db) => this.runSELECT("SELECT value FROM SETTINGS WHERE name = ?", [key]))
            .then((result) => { 
                if (result.length == 0) {
                    return {}
                } else {
                    return JSON.parse(result[0].value); 
                }
            });
    }

    updateSetting(key: string, value: any): Promise<number> {
        console.log("DBProvider.updateSetting(\"" + key + "\")");

        return this.openDB()
            .then((db) => this.runDML("INSERT OR REPLACE INTO SETTINGS (name, value) VALUES (?,?)", [key, JSON.stringify(value, null, 4)]))
    }

    getAllDecks(): Promise<Array<any>> {
        console.log("DBProvider.getAllDecks()");

        // return this.allDecks;
        return this.openDB()
            .then((db) => this.runSELECT("SELECT * FROM DECKS"));
    }

    // Return an array of all cards in all decks that are marked active AND
    // match the deckFilter string.
    getCurrentCardStack(deckFilter: string): Promise<Array<Card>> {
        console.log("DBProvider.getCurrentCardStack()");

        return Promise.resolve([]);
    }

    getNextCard(): Promise<Card|void> {
        console.log("DBProvider.getNextCard()");
        
        return this.openDB()
            .then(() => { return { "id": "XXX", "front": "Vorne", "back": "Hinten" }; } );
    }

    updateDeck(deck: Deck): Promise<number> {
        console.log("DBProvider.updateDeck(\"" + deck.name + "\")");
        
        return this.runDML("UPDATE DECKS SET name = ?, active = ? WHERE (id = ?)", [deck.name, deck.active, deck.id]);
    }

} // of class
