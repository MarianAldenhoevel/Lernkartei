import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { TrainPage } from '../pages/train/train';
import { StatsPage } from '../pages/stats/stats';
import { DecksPage } from '../pages/decks/decks';
import { SettingsPage } from '../pages/settings/settings';

import { DecksProvider } from '../providers/decks';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    TrainPage,
    StatsPage,
    DecksPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    TrainPage,
    StatsPage,
    DecksPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DecksProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
