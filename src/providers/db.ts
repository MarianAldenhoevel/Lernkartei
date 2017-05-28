import { Injectable } from "@angular/core";

import { Device } from "@ionic-native/device";
import { SQLite } from "@ionic-native/sqlite";

import * as jQuery from "jquery";

import { Md5 } from 'ts-md5/dist/md5';

import { Deck, Card, StackImport, Session } from "../types/types";

@Injectable()
export class DBProvider {

    private db = null;

    constructor(private device: Device, private sqlite: SQLite) {
        // console.log("DBProvider.constructor()");
    }

    // Return wether to use WebSQL or SQLite. SQLite is available
    // only on the device, while WebSQL can also be used in the
    // browser platform.
    useWebSQL(): boolean {
        // return !this.device.cordova || (this.device.platform == "core");
        return true;
    }

    // Return a string describing the params-array passed with a
    // SQL statement. This is a logging-/debugging-aid.
    private paramsToLog(params?: Array<any>): string {
        // console.log("paramsToLog()");

        let result: string = "[";

        // Do we have params at all?
        if (params) {
            // For each param
            for (let i = 0; i < params.length; i++) {
                // Add separator if not first param.
                if (i > 0) {
                    result += ", ";
                }
                let v = params[i];

                // Translate a few types to special strings. Quote
                // actual string so we know they are not converted
                // from something else.
                if (v === undefined) {
                    result += "undefined";
                } else if (v === null) {
                    result += "null";
                } else if (typeof v === 'string' || v instanceof String) {
                    result += "\"" + v + "\"";
                } else {
                    result += v.toString();
                }
            }
        }

        result += "]";

        return result;
    }

    // Resolves to a SLQResult interface which can include last inserted ID,
    // rows affected and row-data returned.
    runSQL(sql: string, params?: Array<any>): Promise<any> {
        // console.log("DBProvider.runSQL(\"" + sql + "\") - " + this.paramsToLog(params));

        if (this.useWebSQL()) {
            let ops = new Promise<any>(resolve => {
                // console.log("DBProvider.runSQL(\"" + sql + "\") - " + this.paramsToLog(params) + " - transaction()"); 

                this.db.transaction(
                    (tx) => {
                        // console.log("DBProvider.runSQL(\"" + sql + "\") - " + this.paramsToLog(params) + " - executeSql()"); 

                        tx.executeSql(sql, (params ? params : []), (tx, result) => {
                            // console.log("DBProvider.runSQL(\"" + sql + "\") - " + this.paramsToLog(params) + " - resolving executeSql result"); 
                            tx = null;
                            resolve(result);
                        }, (tx, error) => {
                            console.error(error.message + "\nSQL:\n" + sql + "\nParams: " + this.paramsToLog(params));
                            return false;
                        });
                    }, (error) => {
                        console.error(error.message + "\nSQL:\n" + sql + "\nParams: " + this.paramsToLog(params));
                        return false;
                    }
                    // , () => { console.log("DBProvider.runSQL(\"" + sql + "\") - " + this.paramsToLog(params) + " - Transaction completed"); }
                )
            });

            return ops;
        } else {
            throw new Error("runSQL() not implemented for SQLite");
        }
    }

    // Data Definition Statement. A Promise that resolves to void.
    runDDL(sql: string, params?: Array<any>): Promise<void> {
        // console.log("DBProvider.runDDL()");

        return this.runSQL(sql, params)
            .then((result) => {
                return;
            });
    }

    // Data Manipulation Statement. A Promise that resolves to the 
    // number of records affected.
    runDML(sql: string, params?: Array<any>): Promise<number> {
        // console.log("DBProvider.runDML()");

        return this.runSQL(sql, params)
            .then((result) => {
                // console.log("DBProvider.runDML() - " + result.rowsAffected + " row" + ((result.rowsAffected == 0 || result.rowsAffected > 1) ? "s" : "" ) + " affected");
                return result.rowsAffected;
            });
    }

    // Insert Statement. A Promise that resolves to the last inserted ID.
    runINSERT(sql: string, params?: Array<any>): Promise<number> {
        // console.log("DBProvider.runINSERT()");

        return this.runSQL(sql, params)
            .then((result) => {
                // console.log("DBProvider.runINSERT() - result.insertId=" + result.insertId);
                return result.insertId;
            });
    }

    // Select Statement. A Promise that resolves to an array of objects 
    // representing the result set.
    runSELECT(sql: string, params?: Array<any>): Promise<Array<any>> {
        // console.log("DBProvider.runSELECT()");

        return this.runSQL(sql, params)
            .then((result) => {
                let rows = [];
                for (let i: number = 0; i < result.rows.length; i++) {
                    let row = result.rows.item(i);
                    rows.push(row);
                };

                // console.log("DBProvider.runSELECT() - " + rows.length + " row" + ((rows.length == 0 || rows.length > 1) ? "s" : "" ) + " returned");

                return rows;
            });
    }

    // Open a deck from an URI to import it. Promise that resolves to an object including
    // meta-data for the stack and the data from the file to be parsed by importDeck().
    openDeckFromUri(uri: string): Promise<StackImport> {
        console.log("DBProvider.openDeckFromUri(\"" + uri + "\")");

        return new Promise<any>(resolve => {
            jQuery.ajax({
                "url": uri,
                "dataType": "text"
            }).done((data) => {
                // console.log("DBProvider.openDeckFromUri(\"" + uri + "\") - read success (" + data.length + " characters).");

                let basename: string = decodeURIComponent(uri).split("/").pop().split("#")[0].split("?")[0];
                let i: number = basename.lastIndexOf(".");
                if (i !== -1) {
                    basename = basename.substring(0, i);
                }

                resolve({ "name": basename, "data": data });
            });
        });
    }

    // Import a deck by creating or updating a record in the DECKS table, the CARDS records
    // and the required DECKCARDS records. 
    importDeck(deckinfo: StackImport): Promise<void> {
        // console.log("DBProvider.importDeck()");

        let deckId: number;

        return this.runDML("INSERT OR REPLACE INTO DECKS (name, active) VALUES (?,?)", [deckinfo.name, 1])
            .then(() => this.runSELECT("SELECT id FROM DECKS WHERE name=?", [deckinfo.name]))
            .then((data: Array<any>) => {
                deckId = data[0].id;
                // console.log("Deck inserted with id " + deckId.toString());            
            }).then(() => {
                var inserts = [];

                try {
                    // Is this JSON data?
                    let data = JSON.parse(deckinfo.data);

                    // Yes, should be an array. Now iterate over the cards.
                    for (let i: number = 0; i < data.length; i++) {
                        var card = data[i];
                        if (!card.id) {
                            card.id = new Md5().start().appendStr(card.front).appendStr(card.back).end(false);
                        };

                        inserts.push(this.runINSERT("INSERT OR REPLACE INTO CARDS (id, front, back) VALUES (?,?,?)", [card.id, card.front, card.back]));
                        inserts.push(this.runINSERT("INSERT OR REPLACE INTO DECK_CARDS (deck_id, card_id) VALUES (?,?)", [deckId, card.id]));
                    }
                } catch (e) {
                    // propably not JSON.
                    throw e;
                }

                return Promise.all(inserts);
            }).then(() => { return; });
    }

    // Create the DB objects for a fresh DB and import the built-in default deck of cards.
    initDB(): Promise<void> {
        // console.log("DBProvider.initDB()");

        return this.runDDL("CREATE TABLE IF NOT EXISTS DECKS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, active INTEGER, UNIQUE(name))")
            .then(() => { return this.runDDL("CREATE TABLE IF NOT EXISTS CARDS (id TEXT PRIMARY KEY, front TEXT, back TEXT, current_box INTEGER)"); })
            .then(() => { return this.runDDL("CREATE TABLE IF NOT EXISTS DECK_CARDS (deck_id INTEGER, card_id TEXT, CONSTRAINT unq_deck_card UNIQUE (deck_id, card_id))"); })
            .then(() => { return this.runDDL("CREATE TABLE IF NOT EXISTS SETTINGS (name TEXT PRIMARY KEY, value TEXT)"); })
            .then(() => { return this.runDDL("CREATE TABLE IF NOT EXISTS SESSIONS (started DATETIME PRIMARY KEY, finished DATETIME, stack_size INTEGER, cards_known INTEGER, cards_unknown INTEGER)"); })

            .then(() => { return this.runDDL("CREATE INDEX IF NOT EXISTS IX_SESSIONS_finished ON SESSIONS (finished)"); })

            /*
            .then(() => { return this.openDeckFromUri("assets/decks/Einmaleins.json"); })
            .then(deckinfo => { return this.importDeck(deckinfo); })
            */

            .then(() => { return this.openDeckFromUri("assets/decks/Zehn Testkarten.json"); })
            .then(deckinfo => { return this.importDeck(deckinfo); })

            .then(() => { return this.openDeckFromUri("assets/decks/Hauptstädte der Welt.json"); })
            .then(deckinfo => { return this.importDeck(deckinfo); });

    }

    // Destroy all DB objects we know of.
    dropDB(): Promise<void> {
        // console.log("DBProvider.dropDB()");

        if (this.useWebSQL()) {
            // There is no support for enumerating or dropping databases in WebSQL.
            // So we simply drop all the tables.
            return this.runDDL("DROP TABLE IF EXISTS DECK_CARDS")
                .then(() => { return this.runDDL("DROP TABLE IF EXISTS CARDS"); })
                .then(() => { return this.runDDL("DROP TABLE IF EXISTS DECKS"); })
                .then(() => { return this.runDDL("DROP TABLE IF EXISTS SETTINGS"); })
                .then(() => { return this.runDDL("DROP TABLE IF EXISTS SESSIONS"); })
        } else {
            throw new Error("dropDB() not implemented for SQLite");
        };
    }

    // Open the DB and keep a reference to it in this provider. Check wether we started
    // fresh and if so call initDB to populate the DB with all necessary objects.
    openDB(): Promise<void> {
        // console.log("DBProvider.openDB()");

        if (this.db) {
            return Promise.resolve(this.db);
        } else {
            let ops: Promise<any> = new Promise<void>(resolve => {
                // console.log("DBProvider.openDB()");
                resolve();
            });

            // Open/create DB, switch on device.platform so browser-development
            // uses WebSQL and production uses SQLite.
            if (this.useWebSQL()) {
                ops = ops.then(() => {
                    // console.log("DBProvider.openDB() - open using WebSQL");
                    return window["openDatabase"]("lernkartei.db", "1.0", "Lernkartei", 5 * 1024 * 1024);
                });
            } else {
                ops = ops.then(() => {
                    // console.log("DBProvider.openDB() - open using SQLite");
                    return this.sqlite.create({ name: 'lernkartei.db', location: 'default' });
                })
            };

            return ops.then(db => {
                // console.log("DBProvider.openDB() - checking wether to initially populate DB");
                this.db = db;
                return this.runSELECT("SELECT name FROM sqlite_master WHERE type='table' AND name='DECKS';");
            }).then(rows => {
                if (rows.length == 0) {
                    // console.log("DBProvider.openDB() - Yes, need to initially populate DB");
                    return this.initDB();
                } else {
                    // console.log("DBProvider.openDB() - No, table DECKS exists, we assume structure is OK.");
                    return;
                }
            }).then(() => {
                // console.log("DBProvider.openDB() - done.");
                return this.db;
            });
        }
    }

    // Load a name setting from the DB.
    loadSetting(key: string): Promise<any> {
        // console.log("DBProvider.getSetting(\"" + key + "\")");

        return this.runSELECT("SELECT value FROM SETTINGS WHERE name = ?", [key])
            .then((result) => {
                if (result.length == 0) {
                    return {}
                } else {
                    return JSON.parse(result[0].value);
                }
            });
    }

    // Save a named setting into the DB.
    updateSetting(key: string, value: any): Promise<number> {
        // console.log("DBProvider.updateSetting(\"" + key + "\")");

        return this.runDML("INSERT OR REPLACE INTO SETTINGS (name, value) VALUES (?,?)", [key, JSON.stringify(value, null, 4)]);
    }

    loadAllDecks(): Promise<Array<any>> {
        // console.log("DBProvider.getAllDecks()");

        // return this.allDecks;
        return this.runSELECT(
            "SELECT " +
            "  d.id, " +
            "  d.name," +
            "  d.active, " +
            "  COUNT(dc.card_id) AS card_count " +
            "FROM DECKS d " +
            "LEFT OUTER JOIN DECK_CARDS dc " +
            "  ON (dc.deck_id = d.id) " +
            "GROUP BY d.id, d.name, d.active"
        );
    }

    // Return an array of all cards in all decks that are marked active AND
    // match the deckFilter string.
    loadCurrentCardStack(deckFilter: string): Promise<Array<Card>> {
        // console.log("DBProvider.getCurrentCardStack()");

        let params = [];
        let q: string = "SELECT c.*,d.name AS deck FROM CARDS c " +
            "INNER JOIN DECK_CARDS dc " +
            "   ON (dc.card_id = c.id) " +
            "INNER JOIN DECKS d " +
            "   ON (d.id = dc.deck_id) " +
            "       AND (d.active) ";
        if (deckFilter) {
            q += "       AND (d.name LIKE ?)";
            params.push(deckFilter);
        }

        return this.runSELECT(q, params);
    }

    loadRecentSessions(): Promise<Array<any>> {
        // console.log("DBProvider.loadRecentSessions()");

        return this.runSELECT("SELECT * FROM SESSIONS ORDER BY finished DESC LIMIT 0,10");
    }

    updateDeck(deck: Deck): Promise<number> {
        // console.log("DBProvider.updateDeck(\"" + deck.name + "\")");

        return this.runDML("UPDATE DECKS SET name = ?, active = ? WHERE (id = ?)", [deck.name, deck.active ? 1 : 0, deck.id]);
    }

    resetDeck(deck: Deck): Promise<number> {
        // console.log("DBProvider.resetDeck(\"" + deck.name + "\")");

        return this.runDML(
            "UPDATE CARDS " +
            "  SET current_box = NULL " +
            "WHERE id IN ( " +
            "  SELECT id " +
            "  FROM CARDS c " +
            "  LEFT OUTER JOIN DECK_CARDS dc " +
            "    ON (dc.card_id = c.id) " +
            "  WHERE (dc.deck_id = ?) " +
            "  )", [deck.id]);
    }

    deleteDeck(deck: Deck): Promise<number> {
        // console.log("DBProvider.deleteDeck(\"" + deck.name + "\")");

        let ops: Promise<any> = this.runDML("DELETE FROM DECK_CARDS WHERE (deck_id = ?)", [deck.id]);
        ops = ops.then(() => this.runDML("DELETE FROM DECKS WHERE (id = ?)", [deck.id]));
        ops = ops.then(() => this.runDML(
            "DELETE FROM CARDS " +
            "WHERE id IN ( " +
            "  SELECT id " +
            "  FROM CARDS c " +
            "  LEFT OUTER JOIN DECK_CARDS dc " +
            "    ON (dc.card_id = c.id) " +
            "  WHERE (dc.card_id IS NULL) " +
            "  )"));

        return ops;
    }

    updateCard(card: Card): Promise<number> {
        // console.log("DBProvider.updateCard(\"" + card.id + "\")");

        return this.runDML("UPDATE CARDS SET current_box = ? WHERE (id = ?)", [card.current_box, card.id]);
    }

    updateSession(session: Session) {
        // console.log("DBProvider.updateSession(\"" + session.started + "\")");

        return this.runDML("INSERT OR REPLACE INTO SESSIONS (started, finished, stack_size, cards_known, cards_unknown) VALUES (?, ?, ?, ?, ?)",
            [
                session.started ? session.started.getTime() : null,
                session.finished ? session.finished.getTime() : null,
                session.stack_size,
                session.cards_known,
                session.cards_unknown
            ]
        );
    }

} // of class
