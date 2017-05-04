import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';

import { Style } from "../../types/types";

import { StyleModal } from '../../modals/style/style';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AboutPage } from '../about/about';

import { SessionProvider } from '../../providers/session';
import { DBProvider } from '../../providers/db';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    constructor(
        private platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private alertCtrl: AlertController,
        public session: SessionProvider,
        public translate: TranslateService,
        private db: DBProvider) {
    }

    aboutClick(event): void {
        console.log("SettingsPage.aboutClick()");

        this.navCtrl.push(AboutPage);
    }

    dropDbClick(event): void {
        console.log("SettingsPage.dropDbClick()");

        let confirm = this.alertCtrl.create({
            "title": this.translate.instant("CONFIRM"),
            "message": this.translate.instant("CONFIRM_DROP_DB"),
            "buttons": [
                {
                    text: this.translate.instant("NO"),
                    role: 'cancel',
                    handler: () => {
                        console.log("SettingsPage.dropDbClick() - cancelled");    
                    }
                },
                {
                    text: this.translate.instant("YES"),
                    handler: () => {
                        console.log("SettingsPage.dropDbClick() - confirmed");

                        this.db.dropDB().then(() => {
                            console.log("SettingsPage.dropDbClick() - exiting");
                            this.platform.exitApp();
                        })
                    }
                }
            ]
        });

        confirm.present();
    }

    pickStyle(styleParams: any, dismissHandler: (style: Style) => void) {
        console.log("SettingsPage.pickStyle()");

        let modal = this.modalCtrl.create(StyleModal, styleParams);
        modal.onDidDismiss(data => {
            if (data) {
                dismissHandler(data.style);
            }
        });

        modal.present();
    }

    cardPresentationModeClick(event): void {
        console.log("SettingsPage.cardPresentationModeClick()");

        this.session.settings.cardPresentationMode = parseInt(event);
    }

    animateCardClick(event): void {
        console.log("SettingsPage.animateCardClick()");

        this.session.settings.animateCard = !this.session.settings.animateCard;
    }

    backgroundStyleClick(event): void {
        console.log("SettingsPage.backgroundStyleClick()");

        this.pickStyle({
            "title": "BACKGROUND_STYLE",
            "style": {
                "backgroundColor": this.session.settings.background,
                "color": "#000000"
            },
            "flags": {
                "useBackgroundColor": true,
                "useColor": false
            }
        }, (style) => { this.session.settings.background = style.backgroundColor });
    }

    cardFrontStyleClick(event): void {
        console.log("SettingsPage.cardFrontStyleClick()");

        this.pickStyle({
            "title": "CARD_FRONT_STYLE",
            "style": Object.assign({}, this.session.settings.card.front),
            "flags": {
                "useBackgroundColor": true,
                "useColor": true
            }
        }, (style) => { Object.assign(this.session.settings.card.front, style); });
    }

    cardBackStyleClick(event): void {
        console.log("SettingsPage.cardBackStyleClick()");

        this.pickStyle({
            "title": "CARD_BACK_STYLE",
            "style": Object.assign({}, this.session.settings.card.back),
            "flags": {
                "useBackgroundColor": true,
                "useColor": true
            }
        }, (style) => { Object.assign(this.session.settings.card.back, style); });
    }

    ionViewWillLeave(): void {
        console.log("SettingsPage.ionViewWillLeave()");

        this.session.saveSettings();
    }

}
