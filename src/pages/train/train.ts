import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Card, CardPresentationMode, Box } from '../../types/types';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { SessionProvider } from '../../providers/session';
import { DBProvider } from '../../providers/db';
import { ToolsProvider } from '../../providers/tools';
import { LoadingProvider } from '../../providers/loading';

@Component({
    selector: 'page-train',
    templateUrl: 'train.html'
})
export class TrainPage {
    public currentCard: Card = null;
    public flipped: boolean = false;
    public animationClass: string = "";
    public animationTimeoutID: number = 0;
    public sessionDuration: string = "";

    @ViewChild("trainingStats") trainingStats;

    constructor(
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        public splashScreen: SplashScreen,
        private loading: LoadingProvider,
        private tools: ToolsProvider,
        public translate: TranslateService,
        public session: SessionProvider,
        public db: DBProvider) {
    }

    updateStats(): void {
        // console.log("TrainPage.updateStats()");

        this.session.getCurrentCardStack().then((deck) => {
            let sections: Array<number> = deck.map((box: Box) => box.unpresented.length + box.presented.length);
            this.trainingStats.updateStats(sections);
        });
    }

    nextCard(): void {
        // console.log("TrainPage.nextCard()");

        this.session.getNextCard().then((card) => {
            switch (this.session.settings.cardPresentationMode) {
                case CardPresentationMode.FrontFirst:
                    // console.log("TrainPage.nextCard() - Present front face");
                    this.flipped = false;
                    break;
                case CardPresentationMode.BackFirst:
                    // console.log("TrainPage.nextCard() - Present back face");
                    this.flipped = true;
                    break;
                case CardPresentationMode.RandomSideFirst:
                    // console.log("TrainPage.nextCard() - Present random face");
                    this.flipped = (Math.random() >= 0.5);
                    break;
                default:
                    // console.log("TrainPage.nextCard() - DEFAULT present front face");
                    this.flipped = false;
                    break;
            };

            // Present the card that was picked. 
            this.currentCard = card;
            this.updateStats();

            if (card == null) {
                // console.log("TrainPage.nextCard() - No card picked");

                // No card was picked. There are two ways this can happen:
                // 1) There are none in the active stack
                // 2) All cards have been presented in this session
                if (this.session.hasCards()) {
                    let alert = this.alertCtrl.create({
                        "title": this.translate.instant("ALERT"),
                        "message": this.translate.instant("ALERT_NEW_SESSION"),
                        "buttons": [
                            {
                                text: this.translate.instant("OK"),
                                handler: () => {
                                    // console.log("TrainPage.nextCard() - New session OK");
                                    this.session.invalidateCurrentCardStack();
                                    this.nextCard();
                                }
                            }
                        ]
                    });

                    alert.present();
                } else {
                    let alert = this.alertCtrl.create({
                        "title": this.translate.instant("ALERT"),
                        "message": this.translate.instant("ALERT_NO_CARDS"),
                        "buttons": [
                            {
                                text: this.translate.instant("OK"),
                                handler: () => {
                                    console.log("TrainPage.nextCard() - No cards OK");
                                }
                            }
                        ]
                    });

                    alert.present();
                }
            }
        });
    }

    cancelAnimation(): void {
        // console.log("TrainPage.cancelAnimation()");

        if (this.animationTimeoutID) {
            clearTimeout(this.animationTimeoutID);
        }

        this.animationTimeoutID = 0;
        this.animationClass = '';
    }

    recordOutcome(known: boolean) {
        // console.log("TrainPage.recordOutcome()");

        if (!this.session.currentSession.started) {
            this.session.startSession();
        }
        this.session.currentSession.finished = new Date();
        this.sessionDuration = this.translate.instant("FOR_PRE") + this.tools.intervalToStr(new Date(this.session.currentSession.started), new Date(this.session.currentSession.finished)) + this.translate.instant("FOR_POST");

        // Are we currently animating a slide out to either
        // side?
        if (this.animationClass == "slidingOutLeft" || this.animationClass == "slidingOutRight") {
            // Yes. This means the user has selected an outcome while the
            // previous card was still flying out. We have already registered
            // the answer on the first click and no next card is presented.
            // The only thing we want to do now is cancel the animation of 
            // the still-flying card and immediately present the next one.
            this.cancelAnimation();
            this.nextCard();
        } else {
            // No sliding-animation is active. So we can now record the
            // outcome on the current card.
            this.session.recordOutcome(this.currentCard, known);
            this.updateStats();

            // And then animate the slide-out of the current card if so
            // requested in the settings.
            if (this.session.settings.animateCard) {
                if (known) {
                    this.animationClass = "slidingOutRight";
                } else {
                    this.animationClass = "slidingOutLeft";
                }

                this.animationTimeoutID = setTimeout(() => {
                    this.cancelAnimation();
                    this.nextCard();
                }, 650);
            } else {
                this.nextCard();
            };

        }
    }

    knowClick(event): void {
        // console.log("TrainPage.knowClick()");
        this.recordOutcome(true);
    }

    dontKnowClick(event): void {
        // console.log("TrainPage.dontKnowClick()");
        this.recordOutcome(false);
    }

    flipClick(event): void {
        // console.log("TrainPage.flipClick()");

        if (this.session.settings.animateCard) {
            // Still animating the flip? If so bail out of the animation and 
            // just display in whatever state we want it.
            if (this.animationTimeoutID) {
                // If it is the flip-out we are currently animating we
                // haven't actually flipped the card yet. The user has requested
                // another flip and expects the card to appear unflipped. Duh.
                // So only flip if we are on the flip-in
                if (this.animationClass == "flippingIn") {
                    this.flipped = !this.flipped;
                }
                this.cancelAnimation();
            } else {
                // Not animating at the moment, schedule regular 
                // flipping-animation. First the flip-out visuals,
                // then the actual flip, and finally the flip-in
                // visual:
                this.animationClass = "flippingOut";
                this.animationTimeoutID = setTimeout(() => {
                    this.flipped = !this.flipped;
                    this.animationClass = "flippingIn";
                    this.animationTimeoutID = setTimeout(() => {
                        this.cancelAnimation();
                    }, 300);
                }, 300);
            }
        } else {
            this.flipped = !this.flipped;
        }
    }

    cardSwipe(event): void {
        // console.log("TrainPage.cardSwiped(" + event.direction + ")");

        switch (event.direction) {
            case 2 /* left */: {
                this.recordOutcome(false);
                break;
            }
            case 4 /* right */: {
                this.recordOutcome(true);
                break;
            }
        }
    }

    ionViewDidEnter(): void {
        // console.log("TrainPage.ionViewDidEnter()");

        this.db.openDB().then(() => {

            this.loading.dismiss();


            if (!this.session.currentSession.started) {
                this.session.startSession();
            }

            this.nextCard();

            this.splashScreen.hide();
        })
    }

    ionViewWillLeave(): void {
        // console.log("TrainPage.ionViewWillLeave()");

        // If we have turned at least one card (timestamp recorded in
        // finished), and have trained for more than a minute save this
        // session.
        if (this.session.currentSession.finished) {
            let ms = this.session.currentSession.finished.getTime() - this.session.currentSession.started.getTime();
            if (ms / (1000 * 60) > 1) {
                this.session.saveSession();
                this.sessionDuration = "";
            }
        }
    }

    ionViewDidLoad(): void {
        // console.log("TrainPage.ionViewDidLoad()");

        this.loading.show();
    }

    /*
    ionViewCanEnter(): boolean {
        console.log("TrainPage.ionViewCanEnter()");
    }
 
    ionViewDidLeave(): void {
        console.log("TrainPage.ionViewDidLeave()");
    }

    ionViewWillEnter(): void {
        console.log("TrainPage.ionViewWillLoad()");
    }
 
    ionViewWillUnload(): void {
        console.log("TrainPage.ionViewWillUnload()");
    }
*/
}
