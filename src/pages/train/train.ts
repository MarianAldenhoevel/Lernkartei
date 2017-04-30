import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Card } from '../../types/types';

import { SessionProvider } from '../../providers/session';

@Component({
    selector: 'page-home',
    templateUrl: 'train.html'
})

export class TrainPage {
    public currentCard: Card = null;
    public flipped: boolean = false;

    constructor(public navCtrl: NavController, public session: SessionProvider) {
        this.nextCard();
    }

    nextCard(): void {
        this.session.getNextCard().then((card) => { this.currentCard = card; });
    }

    knowClick(event): void {
        console.log("Trainpage.knowClick()");

        this.session.know(this.currentCard);
        this.nextCard();
    }

    flipClick(event): void {
        console.log("Trainpage.flipClick()");

        this.flipped = !this.flipped;
    }

    dontKnowClick(event): void {
        console.log("Trainpage.dontKnowClick()");

        this.session.dontKnow(this.currentCard);
        this.nextCard();
    }

    ionViewDidLoad(): void {
        console.log("TrainPage.ionViewDidLoad()");
    }

    ionViewCanEnter(): boolean {
        console.log("TrainPage.ionViewCanEnter()");
        return true;
    }

    ionViewWillEnter(): void {
        console.log("TrainPage.ionViewWillLoad()");
    }

    ionViewDidEnter(): void {
        console.log("TrainPage.ionViewDidEnter()");
    }

    ionViewCanLeave(): boolean {
        console.log("TrainPage.ionViewCanLeave()");
        return true;
    }

    ionViewWillLeave(): void {
        console.log("TrainPage.ionViewWillLeave()");
    }

    ionViewDidLeave(): void {
        console.log("TrainPage.ionViewDidLeave()");
    }

    ionViewWillUnload(): void {
        console.log("TrainPage.ionViewWillUnload()");
    }

}
