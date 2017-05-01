import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LernkarteiApp } from './app.component';

import { Http } from '@angular/http';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { ColorPicker } from '../components/color-picker';

import { StyleModal } from '../modals/style/style';

import { TabsPage } from '../pages/tabs/tabs';
import { TrainPage } from '../pages/train/train';
import { StatsPage } from '../pages/stats/stats';
import { DecksPage } from '../pages/decks/decks';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { ImportDeckPage } from '../pages/import-deck/import-deck';

import { SessionProvider } from '../providers/session';
import { DBProvider } from '../providers/db';

@NgModule({
    declarations: [
        LernkarteiApp,
        ColorPicker,
        StyleModal,
        TabsPage,
        TrainPage,
        StatsPage,
        DecksPage,
        SettingsPage,
        AboutPage,
        ImportDeckPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(LernkarteiApp),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (function (http: Http) { return new TranslateStaticLoader(http, 'assets/i18n', '.json') }),
            deps: [Http]
        })
    ],
    bootstrap: [
        IonicApp
    ],
    entryComponents: [
        LernkarteiApp,
        StyleModal,
        TabsPage,
        TrainPage,
        StatsPage,
        DecksPage,
        SettingsPage,
        AboutPage,
        ImportDeckPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Device,
        AppVersion,
        SessionProvider,
        DBProvider,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})

export class AppModule { }
