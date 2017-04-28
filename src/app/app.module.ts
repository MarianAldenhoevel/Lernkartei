import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LernkarteiApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

import { TabsPage } from '../pages/tabs/tabs';
import { TrainPage } from '../pages/train/train';
import { StatsPage } from '../pages/stats/stats';
import { DecksPage } from '../pages/decks/decks';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { ImportDeckPage } from '../pages/import-deck/import-deck';

import { DataProvider } from '../providers/data';

@NgModule({
  declarations: [
    LernkarteiApp,
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
    IonicModule.forRoot(LernkarteiApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LernkarteiApp,
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
    DataProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
