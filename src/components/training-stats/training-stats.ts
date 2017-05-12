/*
    A component to visualize progress in training a deck of cards.
*/

import { Component } from '@angular/core';

@Component({
    selector: 'training-stats',
    templateUrl: 'training-stats.html'
})
export class TrainingStats {

    public Math: any;

    public sum: number;
    public boxes: Array<number> = [];

    constructor() {
        this.Math = Math;
    }
    
    public updateStats(boxes: Array<number>) {
        // console.log("TrainingState().updateStats(" + JSON.stringify(boxes, null, 4) + ")");

        this.boxes = boxes;
        this.sum = boxes.reduce((acc, val) => (acc + val), 0);
    }
}
