import { Component } from '@angular/core';

import { TrainPage } from '../train/train';
import { StatsPage } from '../stats/stats';
import { DecksPage } from '../decks/decks';
import { SettingsPage } from '../settings/settings';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tabTrainRoot = TrainPage;
    tabStatsRoot = StatsPage;
    tabDecksRoot = DecksPage;
    tabSettingsRoot = SettingsPage;

    constructor() {

    }
}
