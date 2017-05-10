export interface Deck {
    "id": number,
    "name": string,
    "active": boolean,
    "card_count": number
}

export interface Card {
    "id": string,
    "front": string,
    "back": string,
    "current_box": number
}

export enum CardPresentationMode {
    FrontFirst = 1,
    BackFirst = 2,
    RandomSideFirst = 3
}

export enum CardDowngradeMode {
    ToFirstBox = 1,
    OneBoxDown = 2
}

export interface Style {
    "backgroundColor": string,
    "color": string
}
