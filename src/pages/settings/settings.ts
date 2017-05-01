import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';

import { Style } from "../../types/types";

import { StyleModal } from '../../modals/style/style';

import { AboutPage } from '../about/about';

import { SessionProvider } from '../../providers/session';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public session: SessionProvider) {
    }

    aboutClick(event): void {
        console.log("SettingsPage.aboutClick()");

        this.navCtrl.push(AboutPage);
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
            "style": this.session.settings.card.front,
            "flags": {
                "useBackgroundColor": true,
                "useColor": true
            }
        }, (style) => { this.session.settings.card.front = style });
    }

    cardBackStyleClick(event): void {
        console.log("SettingsPage.cardBackStyleClick()");

        this.pickStyle({
            "title": "CARD_BACK_STYLE",
            "style": this.session.settings.card.back,
            "flags": {
                "useBackgroundColor": true,
                "useColor": true
            }
        }, (style) => { this.session.settings.card.back = style });
    }
}
