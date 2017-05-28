import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class ConfirmProvider {

    constructor(
        private alertCtrl: AlertController,
        public translate: TranslateService) {
        // console.log('ConfirmProvider.constructor()');
    }

    // Resolves to the string that was input by the user and rejects on cancel
    prompt(title, prompt, defaultvalue): Promise<string> {
        return new Promise((resolve, reject) => {

            let dialog = this.alertCtrl.create({
                "title": title,
                "message": prompt,
                "inputs": [
                    {
                        "name": "input",
                        "placeholder": defaultvalue
                    }
                ],
                buttons: [
                    {
                        text: this.translate.instant("OK"),
                        role: 'cancel',
                        handler: data => {
                            // console.log("ConfirmProvider.prompt() - cancelled");
                            resolve(data.input);
                        }
                    },
                    {
                        text: this.translate.instant("CANCEL"),
                        handler: () => {
                            // console.log("DecksPage.prompt() - confirmed");
                            reject("cancelled");
                        }
                    }
                ]
            });

            dialog.present();
        })
    }

    error(msg) {
        let confirm = this.alertCtrl.create({
            "title": this.translate.instant("ERROR"),
            "message": msg,
            "buttons": [
                { text: this.translate.instant("OK") }
            ]
        });

        confirm.present();
    }

    // Return a promise that resolves to true if the confirmation
    // is dismissed with the yes-button, false if not.
    yesNo(msg): Promise<boolean> {
        // console.log("ConfirmProvider.confirm()");

        return new Promise((resolve, reject) => {
            let confirm = this.alertCtrl.create({
                "title": this.translate.instant("CONFIRM"),
                "message": msg,
                "buttons": [
                    {
                        text: this.translate.instant("NO"),
                        role: 'cancel',
                        handler: () => {
                            // console.log("ConfirmProvider.yesNo() - cancelled");
                            resolve(false);
                        }
                    },
                    {
                        text: this.translate.instant("YES"),
                        handler: () => {
                            // console.log("DecksPage.yesNo() - confirmed");
                            resolve(true);
                        }
                    }
                ]
            });

            confirm.present();
        });
    }

} // of class
