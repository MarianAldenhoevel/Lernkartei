export interface Deck {
    "id": number,
    "name": string,
    "active": boolean,
    "count": number
}

export interface Card {
    "id": string,
    "front": string,
    "back": string
}

export enum CardPresentationMode {
    FrontFirst = 1,
    BackFirst = 2,
    RandomSideFirst = 3
}

export enum CardStatus {
    NeverAnswered = 0,
    Unknown = 1,
    Known =2
}

export enum Outcome {
    Known = 1,
    Unknown = 2
}

export interface Style {
    "backgroundColor": string,
    "color": string
}
