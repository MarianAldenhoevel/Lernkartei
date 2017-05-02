import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

export interface StyleModalParams {
    "title": string,
    "style": {
        "backgroundColor": string,
        "color": string,
    },
    "flags": {
        "useBackgroundColor": boolean,
        "useColor": boolean
    }
}

@Component({
    selector: 'style-modal',
    templateUrl: 'style.html'
})
export class StyleModal {
    private modalParams: StyleModalParams = {
        "title": "Pick a Color",
        "style": {
            "backgroundColor": "#ffffff",
            "color": "#000000",
        },
        "flags": {
            "useBackgroundColor": true,
            "useColor": true
        }
    };

    constructor(private viewCtrl: ViewController, public params: NavParams) {
        // console.log("StyleModal.constructor()");

        this.modalParams.title = this.params.get("title");
        this.modalParams.style = this.params.get("style");
        this.modalParams.flags = this.params.get("flags");    
    }

    setBackgroundColor(event): void {
        // console.log("StyleModal.setBackgroundColor()");
        
        if (this.modalParams.flags.useBackgroundColor) {
            this.modalParams.style.backgroundColor = event;
        }
    }

    setColor(event): void {
        // console.log("StyleModal.setColor()");
        
        if (this.modalParams.flags.useColor) {
            this.modalParams.style.color = event;
        }
    }

    okClick(data) {
        // console.log("StyleModal.okClick()");

        this.viewCtrl.dismiss(this.modalParams);
    }

    cancelClick(data) {
        // console.log("StyleModal.cancelClick()");

        this.viewCtrl.dismiss();
    }

}
