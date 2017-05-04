import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Card, CardPresentationMode, Outcome } from '../../types/types';

import { SessionProvider } from '../../providers/session';

@Component({
    selector: 'page-train',
    templateUrl: 'train.html'
})
export class TrainPage {
    public currentCard: Card = null;
    public flipped: boolean = false;
    public animationClass: string = "";
    public animationTimeoutID: number = 0;

    constructor(public navCtrl: NavController, public splashScreen: SplashScreen, public session: SessionProvider) {
    }

    nextCard(): void {
        console.log("TrainPage.nextCard()");

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

            this.currentCard = card; 
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

    animateNextCard(animationClass: string): void {
        console.log("TrainPage.animateNextCard(\"" + animationClass + "\")");

        
    }

    recordOutcome(outcome: Outcome) {
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
            this.session.recordOutcome(this.currentCard, outcome);
            
            // And then animate the slide-out of the current card if so
            // requested in the settings.
            if (this.session.settings.animateCard) {
                switch (outcome) {
                    case Outcome.Known: this.animationClass = "slidingOutRight"; break;
                    case Outcome.Unknown: this.animationClass = "slidingOutLeft"; break;
                    default: console.warn("TrainPage.recordOutcome() - Unsupported outcome"); break;
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
        this.recordOutcome(Outcome.Known);
    }

    dontKnowClick(event): void {
        // console.log("TrainPage.dontKnowClick()");
        this.recordOutcome(Outcome.Unknown);
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
                    }, 500);
                }, 500);
            }
        } else {
            this.flipped = !this.flipped;
        }
    }

    ionViewDidLoad(): void {
        console.log("TrainPage.ionViewDidLoad()");

        this.nextCard();
        this.splashScreen.hide();
    }

    /*
        ionViewDidEnter(): void {
            console.log("TrainPage.ionViewDidEnter()");
        }
    
        ionViewCanEnter(): boolean {
            console.log("TrainPage.ionViewCanEnter()");
            return true;
        }
    
        ionViewWillEnter(): void {
            console.log("TrainPage.ionViewWillLoad()");
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
    */
}
