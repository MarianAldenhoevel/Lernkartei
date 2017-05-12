import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Session } from '../../types/types';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { SessionProvider } from '../../providers/session';

@Component({
    selector: 'page-about',
    templateUrl: 'stats.html'
})
export class StatsPage {

    public sessions: Array<Session>;

    constructor(
        public navCtrl: NavController,
        public translate: TranslateService,
        public session: SessionProvider) {
    }

    ionViewDidEnter(): void {
        // console.log("StatsPage.ionViewDidEnter()");

        this.session.getRecentSessions().then((sessions) => { this.sessions = sessions; });
    }

}
