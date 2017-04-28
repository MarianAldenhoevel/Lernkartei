import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';

import { TranslateService } from 'ng2-translate';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})

export class LernkarteiApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, device: Device, translate: TranslateService) {
  
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      translate.setDefaultLang('en');
    
      console.log("navigator.language=\"" + navigator.language + "\"");
      var userLang = navigator.language.split('-')[0];
      userLang = /(de|en)/gi.test(userLang) ? userLang : 'en';
      console.log("User language detected as \"" + userLang + "\"");
      translate.use(userLang);
      translate.use('de');

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
