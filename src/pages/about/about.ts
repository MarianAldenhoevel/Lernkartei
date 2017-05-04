import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SessionProvider } from '../../providers/session';
import { DBProvider } from '../../providers/db';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  constructor(public navCtrl: NavController, public db: DBProvider, public session: SessionProvider) {
  }

}
