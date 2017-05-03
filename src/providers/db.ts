import { Injectable } from "@angular/core";

import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';

// import "rxjs/add/operator/map";

import { Deck, Card } from "../types/types";

@Injectable()
export class DBProvider {

    private allDecks: Array<Deck> =
    [
        { "id": 1, "name": "Cornelsen G21 A4 Introduction", "active": false, "count": 4 },
        { "id": 2, "name": "Cornelsen G21 A4 Unit 1", "active": false, "count": 7 },
        { "id": 3, "name": "Cornelsen G21 A4 Unit 2", "active": false, "count": 12 },
        { "id": 4, "name": "Hauptstädte der Welt", "active": false, "count": 100 }
    ];

    private allCards: Array<Card> =
    [
        { "id": "i_01", "front": "(to) form", "back": "bilden" },
        { "id": "i_02", "front": "gorge", "back": "Schlucht" },
        { "id": "i_03", "front": "colorful, colourful", "back": "bunt" },
        { "id": "i_04", "front": "kilometre, kilometre", "back": "Kilometer" },

        { "id": "1_01", "front": "immigration", "back": "Einwanderung" },
        { "id": "1_02", "front": "immigrant", "back": "Einwanderer" },
        { "id": "1_03", "front": "avenue", "back": "Alee, Boulevard" },

        { "id": "2_01", "front": "bow", "back": "Bogen" },
        { "id": "2_02", "front": "arrow", "back": "Pfeil" },
        { "id": "2_03", "front": "turkey", "back": "Pute, Truhahn" },
        { "id": "2_04", "front": "smoke", "back": "Rauch" },

        { "id": "H_04", "front": "Europäische Union", "back": "Brüssel" },
        { "id": "H_05", "front": "Afrikanische Union", "back": "Addis Abeba" },
        { "id": "H_06", "front": "Verband Südostasiatischer Nationen", "back": "Jakarta" },
        { "id": "H_07", "front": "Union Südamerikanischer Nationen", "back": "Quito" },
        { "id": "H_08", "front": "Abchasien", "back": "Sochumi" },
        { "id": "H_09", "front": "Afghanistan", "back": "Kabul" },
        { "id": "H_10", "front": "Ägypten", "back": "Kairo" },
        { "id": "H_11", "front": "Albanien", "back": "Tirana" },
        { "id": "H_12", "front": "Algerien", "back": "Algier" },
        { "id": "H_13", "front": "Andorra", "back": "Andorra la Vella" },
        { "id": "H_14", "front": "Angola", "back": "Luanda" },
        { "id": "H_15", "front": "Antigua und Barbuda", "back": "Saint John’s" },
        { "id": "H_16", "front": "Äquatorialguinea", "back": "Malabo" },
        { "id": "H_17", "front": "Argentinien", "back": "Buenos Aires" },
        { "id": "H_18", "front": "Armenien", "back": "Jerewan" },
        { "id": "H_19", "front": "Aserbaidschan", "back": "Baku" },
        { "id": "H_20", "front": "Äthiopien", "back": "Addis Abeba" },
        { "id": "H_21", "front": "Australien", "back": "Canberra" },
        { "id": "H_22", "front": "Bahamas", "back": "Nassau" },
        { "id": "H_23", "front": "Bahrain", "back": "Manama" },
        { "id": "H_24", "front": "Bangladesch", "back": "Dhaka" },
        { "id": "H_25", "front": "Barbados", "back": "Bridgetown" },
        { "id": "H_26", "front": "Belgien", "back": "Brüssel" },
        { "id": "H_27", "front": "Belize", "back": "Belmopan" },
        { "id": "H_28", "front": "Benin", "back": "Porto Novo" },
        { "id": "H_29", "front": "Bergkarabach", "back": "Stepanakert" },
        { "id": "H_30", "front": "Bhutan", "back": "Thimphu" },
        { "id": "H_31", "front": "Bolivien", "back": "Sucre" },
        { "id": "H_32", "front": "Bosnien und Herzegowina", "back": "Sarajevo" },
        { "id": "H_33", "front": "Botswana", "back": "Gaborone" },
        { "id": "H_34", "front": "Brasilien", "back": "Brasília" },
        { "id": "H_35", "front": "Brunei", "back": "Bandar Seri Begawan" },
        { "id": "H_36", "front": "Bulgarien", "back": "Sofia" },
        { "id": "H_37", "front": "Burkina Faso", "back": "Ouagadougou" },
        { "id": "H_38", "front": "Burundi", "back": "Bujumbura" },
        { "id": "H_39", "front": "Chile", "back": "Santiago de Chile" },
        { "id": "H_40", "front": "Republik China", "back": "Taipeh" },
        { "id": "H_41", "front": "Volksrepublik China", "back": "Peking" },
        { "id": "H_44", "front": "Cookinseln", "back": "Avarua" },
        { "id": "H_45", "front": "Costa Rica", "back": "San José" },
        { "id": "H_46", "front": "Dänemark", "back": "Kopenhagen" },
        { "id": "H_50", "front": "Deutschland", "back": "Berlin" },
        { "id": "H_51", "front": "Dominica", "back": "Roseau" },
        { "id": "H_52", "front": "Dominikanische Republik", "back": "Santo Domingo" },
        { "id": "H_53", "front": "Dschibuti", "back": "Dschibuti-Stadt" },
        { "id": "H_54", "front": "Ecuador", "back": "Quito" },
        { "id": "H_55", "front": "El Salvador", "back": "San Salvador" },
        { "id": "H_56", "front": "Elfenbeinküste", "back": "Yamoussoukro" },
        { "id": "H_57", "front": "Eritrea", "back": "Asmara" },
        { "id": "H_58", "front": "Estland", "back": "Tallinn" },
        { "id": "H_59", "front": "Fidschi", "back": "Suva" },
        { "id": "H_60", "front": "Finnland", "back": "Helsinki" },
        { "id": "H_61", "front": "Frankreich", "back": "Paris" },
        { "id": "H_63", "front": "Gabun", "back": "Libreville" },
        { "id": "H_64", "front": "Gambia", "back": "Banjul" },
        { "id": "H_65", "front": "Georgien", "back": "Tiflis" },
        { "id": "H_67", "front": "Ghana", "back": "Accra" },
        { "id": "H_68", "front": "Grenada", "back": "St. George’s" },
        { "id": "H_69", "front": "Griechenland", "back": "Athen" },
        { "id": "H_70", "front": "Guatemala", "back": "Guatemala-Stadt" },
        { "id": "H_71", "front": "Guinea", "back": "Conakry" },
        { "id": "H_72", "front": "Guinea-Bissau", "back": "Bissau" },
        { "id": "H_73", "front": "Guyana", "back": "Georgetown" },
        { "id": "H_74", "front": "Haiti", "back": "Port-au-Prince" },
        { "id": "H_75", "front": "Honduras", "back": "Tegucigalpa" },
        { "id": "H_76", "front": "Indien", "back": "Neu-Delhi" },
        { "id": "H_78", "front": "Indonesien", "back": "Jakarta" },
        { "id": "H_79", "front": "Irak", "back": "Bagdad" },
        { "id": "H_80", "front": "Iran", "back": "Teheran" },
        { "id": "H_81", "front": "Irland", "back": "Dublin" },
        { "id": "H_82", "front": "Island", "back": "Reykjavík" },
        { "id": "H_83", "front": "Israel", "back": "Jerusalem" },
        { "id": "H_85", "front": "Italien", "back": "Rom" },
        { "id": "H_86", "front": "Jamaika", "back": "Kingston" },
        { "id": "H_87", "front": "Japan", "back": "Tokio" },
        { "id": "H_88", "front": "Jemen", "back": "Sanaa" },
        { "id": "H_89", "front": "Jordanien", "back": "Amman" },
        { "id": "H_90", "front": "Kambodscha", "back": "Phnom Penh" },
        { "id": "H_91", "front": "Kamerun", "back": "Yaoundé" },
        { "id": "H_92", "front": "Kanada", "back": "Ottawa" },
        { "id": "H_93", "front": "Kap Verde", "back": "Praia" },
        { "id": "H_94", "front": "Kasachstan", "back": "Astana" },
        { "id": "H_95", "front": "Katar", "back": "Doha" },
        { "id": "H_96", "front": "Kenia", "back": "Nairobi" },
        { "id": "H_97", "front": "Kirgisistan", "back": "Bischkek" },
        { "id": "H_98", "front": "Kiribati", "back": "South Tarawa" },
        { "id": "H_99", "front": "Kolumbien", "back": "Bogotá" },
        { "id": "H_100", "front": "Komoren", "back": "Moroni" },
        { "id": "H_101", "front": "Kongo, Demokratische Republik", "back": "Kinshasa" },
        { "id": "H_102", "front": "Kongo, Republik", "back": "Brazzaville" },
        { "id": "H_103", "front": "Korea, Nord", "back": "Pjöngjang" },
        { "id": "H_104", "front": "Korea, Süd", "back": "Seoul" },
        { "id": "H_105", "front": "Kosovo", "back": "Prishtina" },
        { "id": "H_106", "front": "Kroatien", "back": "Zagreb" },
        { "id": "H_107", "front": "", "back": "(Agram)" },
        { "id": "H_108", "front": "Kuba", "back": "Havanna" },
        { "id": "H_109", "front": "Kuwait", "back": "Kuwait-Stadt" },
        { "id": "H_110", "front": "Laos", "back": "Vientiane" },
        { "id": "H_111", "front": "Lesotho", "back": "Maseru" },
        { "id": "H_112", "front": "Lettland", "back": "Riga" },
        { "id": "H_113", "front": "Libanon", "back": "Beirut" },
        { "id": "H_114", "front": "Liberia", "back": "Monrovia" },
        { "id": "H_115", "front": "Libyen", "back": "Tripolis" },
        { "id": "H_116", "front": "Liechtenstein", "back": "Vaduz" },
        { "id": "H_117", "front": "Litauen", "back": "Vilnius" },
        { "id": "H_118", "front": "", "back": "(Wilna)" },
        { "id": "H_119", "front": "Luxemburg", "back": "Luxemburg" },
        { "id": "H_120", "front": "Madagaskar", "back": "Antananarivo" },
        { "id": "H_121", "front": "Malawi", "back": "Lilongwe" },
        { "id": "H_122", "front": "Malaysia", "back": "Kuala Lumpur" },
        { "id": "H_123", "front": "Malediven", "back": "Malé" },
        { "id": "H_124", "front": "Mali", "back": "Bamako" },
        { "id": "H_125", "front": "Malta", "back": "Valletta" },
        { "id": "H_126", "front": "Marokko", "back": "Rabat" },
        { "id": "H_128", "front": "Marshallinseln", "back": "Majuro" },
        { "id": "H_129", "front": "Mauretanien", "back": "Nouakchott" },
        { "id": "H_130", "front": "Mauritius", "back": "Port Louis" },
        { "id": "H_131", "front": "Mazedonien", "back": "Skopje" },
        { "id": "H_132", "front": "Mexiko", "back": "Mexiko-Stadt" },
        { "id": "H_133", "front": "Mikronesien", "back": "Palikir" },
        { "id": "H_134", "front": "Moldawien", "back": "Chișinău" },
        { "id": "H_136", "front": "Monaco", "back": "Stadtstaat" },
        { "id": "H_137", "front": "Mongolei", "back": "Ulaanbaatar" },
        { "id": "H_138", "front": "Montenegro", "back": "Podgorica" },
        { "id": "H_139", "front": "Mosambik", "back": "Maputo" },
        { "id": "H_140", "front": "Myanmar", "back": "Naypyidaw" },
        { "id": "H_141", "front": "Namibia", "back": "Windhoek" },
        { "id": "H_142", "front": "Nauru", "back": "Yaren" },
        { "id": "H_143", "front": "Nepal", "back": "Kathmandu" },
        { "id": "H_144", "front": "Neuseeland", "back": "Wellington" },
        { "id": "H_145", "front": "Nicaragua", "back": "Managua" },
        { "id": "H_146", "front": "Königreich der Niederlande", "back": "Amsterdam" },
        { "id": "H_148", "front": "Niger", "back": "Niamey" },
        { "id": "H_149", "front": "Nigeria", "back": "Abuja" },
        { "id": "H_150", "front": "Niue", "back": "Alofi" },
        { "id": "H_151", "front": "Nordzypern", "back": "Lefkosa" },
        { "id": "H_152", "front": "Norwegen", "back": "Oslo" },
        { "id": "H_154", "front": "Oman", "back": "Maskat" },
        { "id": "H_155", "front": "Österreich", "back": "Wien" },
        { "id": "H_156", "front": "Osttimor / Timor-Leste", "back": "Dili" },
        { "id": "H_157", "front": "Pakistan", "back": "Islamabad" },
        { "id": "H_159", "front": "Palästina", "back": "Ostjerusalem (Gaza und Ramallah)" },
        { "id": "H_160", "front": "Palau", "back": "Melekeok" },
        { "id": "H_161", "front": "Panama", "back": "Panama-Stadt" },
        { "id": "H_162", "front": "Papua-Neuguinea", "back": "Port Moresby" },
        { "id": "H_163", "front": "Paraguay", "back": "Asunción" },
        { "id": "H_164", "front": "Peru", "back": "Lima" },
        { "id": "H_165", "front": "Philippinen", "back": "Manila" },
        { "id": "H_166", "front": "Polen", "back": "Warschau" },
        { "id": "H_167", "front": "Portugal", "back": "Lissabon" },
        { "id": "H_168", "front": "Ruanda", "back": "Kigali" },
        { "id": "H_169", "front": "Rumänien", "back": "Bukarest" },
        { "id": "H_170", "front": "Russland", "back": "Moskau" },
        { "id": "H_171", "front": "Salomonen", "back": "Honiara" },
        { "id": "H_172", "front": "Sambia", "back": "Lusaka" },
        { "id": "H_173", "front": "Samoa", "back": "Apia" },
        { "id": "H_174", "front": "San Marino", "back": "San Marino" },
        { "id": "H_175", "front": "São Tomé und Príncipe", "back": "São Tomé" },
        { "id": "H_176", "front": "Saudi-Arabien", "back": "Riad" },
        { "id": "H_177", "front": "Schweden", "back": "Stockholm" },
        { "id": "H_178", "front": "Schweiz", "back": "Bern" },
        { "id": "H_179", "front": "Senegal", "back": "Dakar" },
        { "id": "H_180", "front": "Serbien", "back": "Belgrad" },
        { "id": "H_182", "front": "Seychellen", "back": "Victoria" },
        { "id": "H_183", "front": "Sierra Leone", "back": "Freetown" },
        { "id": "H_184", "front": "Simbabwe", "back": "Harare" },
        { "id": "H_185", "front": "Singapur", "back": "Stadtstaat" },
        { "id": "H_186", "front": "Slowakei", "back": "Bratislava" },
        { "id": "H_187", "front": "", "back": "(Pressburg)" },
        { "id": "H_188", "front": "Slowenien", "back": "Ljubljana" },
        { "id": "H_189", "front": "", "back": "(Laibach)" },
        { "id": "H_190", "front": "Somalia", "back": "Mogadischu" },
        { "id": "H_192", "front": "Somaliland", "back": "Hargeysa" },
        { "id": "H_193", "front": "Spanien", "back": "Madrid" },
        { "id": "H_194", "front": "Sri Lanka", "back": "Colombo" },
        { "id": "H_195", "front": "St. Kitts und Nevis", "back": "Basseterre" },
        { "id": "H_196", "front": "St. Lucia", "back": "Castries" },
        { "id": "H_197", "front": "St. Vincent und die Grenadinen", "back": "Kingstown" },
        { "id": "H_198", "front": "Südafrika", "back": "Pretoria" },
        { "id": "H_199", "front": "Sudan", "back": "Khartum" },
        { "id": "H_200", "front": "Südossetien", "back": "Zchinwali" },
        { "id": "H_201", "front": "Südsudan", "back": "Juba" },
        { "id": "H_202", "front": "Suriname", "back": "Paramaribo" },
        { "id": "H_203", "front": "Swasiland", "back": "Mbabane" },
        { "id": "H_204", "front": "Syrien", "back": "Damaskus" },
        { "id": "H_206", "front": "Tadschikistan", "back": "Duschanbe" },
        { "id": "H_207", "front": "Tansania", "back": "Dodoma" },
        { "id": "H_208", "front": "Thailand", "back": "Bangkok" },
        { "id": "H_209", "front": "Togo", "back": "Lomé" },
        { "id": "H_210", "front": "Tonga", "back": "Nukuʻalofa" },
        { "id": "H_211", "front": "Transnistrien", "back": "Tiraspol" },
        { "id": "H_212", "front": "Trinidad und Tobago", "back": "Port of Spain" },
        { "id": "H_213", "front": "Tschad", "back": "N’Djamena" },
        { "id": "H_214", "front": "Tschechien", "back": "Prag" },
        { "id": "H_215", "front": "Tunesien", "back": "Tunis" },
        { "id": "H_216", "front": "Türkei", "back": "Ankara" },
        { "id": "H_217", "front": "Turkmenistan", "back": "Aschgabad" },
        { "id": "H_218", "front": "Tuvalu", "back": "Funafuti" },
        { "id": "H_219", "front": "Uganda", "back": "Kampala" },
        { "id": "H_220", "front": "Ukraine", "back": "Kiew" },
        { "id": "H_221", "front": "Ungarn", "back": "Budapest" },
        { "id": "H_222", "front": "Uruguay", "back": "Montevideo" },
        { "id": "H_223", "front": "Usbekistan", "back": "Taschkent" },
        { "id": "H_224", "front": "Vanuatu", "back": "Port Vila" },
        { "id": "H_225", "front": "Vatikanstadt", "back": "Stadtstaat" },
        { "id": "H_226", "front": "Venezuela", "back": "Caracas" },
        { "id": "H_227", "front": "Vereinigte Arabische Emirate", "back": "Abu Dhabi" },
        { "id": "H_228", "front": "Vereinigte Staaten", "back": "Washington, D.C." },
        { "id": "H_230", "front": "Vereinigtes Königreich", "back": "London" },
        { "id": "H_232", "front": "Vietnam", "back": "Hanoi" },
        { "id": "H_233", "front": "Weißrussland", "back": "Minsk" },
        { "id": "H_234", "front": "Westsahara", "back": "El Aaiún" },
        { "id": "H_235", "front": "Zentralafrikanische Republik", "back": "Bangui" },
        { "id": "H_236", "front": "Zypern", "back": "Nikosia" }
    ];

    private db = null;

    constructor(private device: Device, private sqlite: SQLite) {
        console.log("DBProvider.constructor()");
    }

    useWebSQL(): boolean {
        return !this.device.cordova || (this.device.platform == "core");
    }

    runQuery(sql: string, params?: Array<any>): Promise<any> {
        console.log("DBProvider.runQuery(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "]");

        if (this.useWebSQL()) {
            let ops = new Promise<any>(resolve => {
                // console.log("DBProvider.runQuery(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - Start transaction"); 
                this.db.transaction(
                    (tx) => { resolve(tx); }
                    ,(error) => { throw error; }
                    // ,() => { console.log("DBProvider.runQuery(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - Transaction completed"); }
                )
            });
            ops = ops.then((tx) => {
                return new Promise<any>(resolve => {
                    tx.executeSql(sql, (params ? params : []), (tx, result) => {
                        /*
                        let msg: string = "DBProvider.runQuery(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - Result:\n";
                        msg = msg + "insertRowId: " +  result.insertRowId + "\n";
                        msg = msg + "rowsAffected: " + result.rowsAffected  + "\n";                    
                        msg = msg + "rows.length: " +  result.rows.length;
                        console.log(msg);
                        */
                        let rows = [];
                        for ( let i: number = 0 ; i<result.rows.length ; i++ ) {
                            let row = result.rows.item(i);
                            rows.push(row);
                        };
                        
                        // console.log("DBProvider.runQuery(\"" + sql + "\") - [" + (params ? params.join(", ") : "") + "] - Result:\n" + JSON.stringify(rows, null, 4));

                        resolve(rows);
                    }, (tx, error) => {
                        console.error(error.message + "\nSQL:\n" + sql + "\nParams: [" + (params ? params.join(", ") : "") + "]");
                        throw error;
                    });
                });
            });

            return ops;
        } else {
            throw new Error("runQuery() not implemented for SQLite");
        }
    }

    initDB(): Promise<any> {
        console.log("DBProvider.initDB()");

        let ops = this.runQuery("CREATE TABLE IF NOT EXISTS DECKS (ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, ACTIVE INTEGER)");
        ops = ops.then((rows) => this.runQuery("INSERT INTO DECKS (NAME, ACTIVE) VALUES (?,?)", ["Hauptstädte der Welt", 1]));
        ops = ops.then((rows) => this.runQuery("INSERT INTO DECKS (NAME, ACTIVE) VALUES (?,?)", ["Another deck", 0]));
        
        ops = ops.then((rows) => this.runQuery("CREATE TABLE IF NOT EXISTS CARDS (ID TEXT PRIMARY KEY, FRONT TEXT, BACK TEXT)"));
        
        return ops;
    }

    openDB(): Promise<any> {
        console.log("DBProvider.openDB()");

        if (this.db) {
            return Promise.resolve(this.db);
        } else {
            let ops: Promise<any> = new Promise<any>(resolve => {
                console.log("DBProvider.openDB() - ops start");
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
                console.log("DBProvider.openDB() - checking wether to initially populate DB");
                this.db = db;
                return this.runQuery("SELECT name FROM sqlite_master WHERE type='table' AND name='DECKS';");
            });
            ops = ops.then((rows) => {
                if (rows.length == 0) {
                    console.log("DBProvider.openDB() - Yes, need to initially populate DB");
                    return this.initDB();
                } else {
                    console.log("DBProvider.openDB() - No, table DECKS exists.");
                    return([]);
                }
            });
            ops = ops.then((data) => {
                console.log("DBProvider.openDB() - done.");
                return this.db;
            });

            return ops;
        }
    }

    getAllDecks(): Promise<Array<Deck>> {
        console.log("DBProvider.getAllDecks()");

        return Promise.resolve(this.allDecks);
    }

    // Return an array of all cards in all decks that are marked active AND
    // match the deckFilter string.
    getCurrentCardStack(deckFilter: string): Promise<Array<Card>> {
        console.log("DBProvider.getCurrentCardStack()");

        return Promise.resolve(this.allCards);
    }

    private currentCardIndex: number = 0;

    getNextCard(): Promise<Card> {
        console.log("DBProvider.getNextCard()");

        this.currentCardIndex = (this.currentCardIndex + 1) % this.allCards.length;

        return Promise.resolve(this.allCards[this.currentCardIndex]);
    }

} // of class
