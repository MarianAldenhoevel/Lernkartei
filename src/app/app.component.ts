import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';

import { TranslateService } from 'ng2-translate';

import { TabsPage } from '../pages/tabs/tabs';

import { SessionProvider } from '../providers/session';
import { DBProvider } from '../providers/db';

@Component({
    templateUrl: 'app.html'
})
export class LernkarteiApp {
    rootPage: any = TabsPage;

    constructor(
        platform: Platform, 
        statusBar: StatusBar, 
        splashScreen: SplashScreen, 
        device: Device, 
        translate: TranslateService, 
        session: SessionProvider, 
        db: DBProvider) {
        
        // console.log("LernkarteApp.constructor()");

        platform.ready().then(() => {
            // console.log("LernkarteApp.constructor().ready()");

            db.openDB().then(() => session.loadSettings());

            // Set up translation-system
            translate.setDefaultLang('en');

            // console.log("navigator.language=\"" + navigator.language + "\"");
            var userLang = navigator.language.split('-')[0];
            userLang = /(de|en)/gi.test(userLang) ? userLang : 'en';
            // console.log("User language detected as \"" + userLang + "\"");
            translate.use(userLang);
            translate.use('de');

            statusBar.styleDefault();
        });
    }
}
