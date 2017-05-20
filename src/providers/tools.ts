import { Injectable } from '@angular/core';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class ToolsProvider {

    constructor(
        public translate: TranslateService) {
        // console.log('ToolsProvider.constructor()');
    }

    intervalToStr(started, finished: Date): string {
        // console.log("SessionProvider.intervalToStr(" + (started ? started.getTime() : "null") + "," + (finished ? finished.getTime() : "null") + ")");

        // In years
        let y = finished.getFullYear() - started.getFullYear();
        if (y) {
            return y.toString() + " " + ((y == 1) ? this.translate.instant("YEAR") : this.translate.instant("YEARS"));
        }

        // In months
        let m = (finished.getMonth() + 12 * finished.getFullYear()) - (started.getMonth() + 12 * started.getFullYear());
        if (m) {
            return m.toString() + " " + ((m == 1) ? this.translate.instant("MONTH") : this.translate.instant("MONTHS"));
        }

        let ms = finished.getTime() - started.getTime();

        // In weeks
        let w = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
        if (w) {
            return w.toString() + " " + ((w == 1) ? this.translate.instant("WEEK") : this.translate.instant("WEEKS"));
        }

        // In days
        let d = Math.floor(ms / (1000 * 60 * 60 * 24));
        if (d) {
            return d.toString() + " " + ((d == 1) ? this.translate.instant("DAY") : this.translate.instant("DAYS"));
        }

        // In hours
        let h = Math.floor(ms / (1000 * 60 * 60));
        if (h) {
            return h.toString() + " " + ((h == 1) ? this.translate.instant("HOUR") : this.translate.instant("HOURS"));
        }

        // In minutes
        let mi = Math.floor(ms / (1000 * 60));
        if (mi) {
            return mi.toString() + " " + ((mi == 1) ? this.translate.instant("MINUTE") : this.translate.instant("MINUTES"));
        }

        return this.translate.instant("UNDER_A_MINUTE");
    }
    
} // of class
