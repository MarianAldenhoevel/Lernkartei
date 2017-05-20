import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class LoadingProvider {

    private level: number = 0;
    private loader = null;

    constructor(
        private loadingCtrl: LoadingController,
        public translate: TranslateService) {
        // console.log('LoadingProvider.constructor()');
    }

    // If loader currently not shown create and display it. If it
    // is already visible just increment level.
    show() {
        // console.log("LoadingProvider.show()");

        if (this.level == 0) {
            this.loader = this.loadingCtrl.create({
                "content": this.translate.instant("LOADING")
            });
            this.loader.present();
        }

        this.level = this.level + 1;
    }

    // Decrement loader-level. If zero dismiss the loader.
    hide() {
        // console.log("LoadingProvider.hide()");

        this.level = this.level - 1;
        if (this.level <= 0) {
            this.dismiss();
        }
    }

    // Immediately dismiss loader, disregarding levels.
    dismiss() {
        // console.log("LoadingProvider.dismiss()");

        if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
        }
        this.level = 0;
    }

} // of class
