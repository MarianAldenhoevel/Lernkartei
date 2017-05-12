export interface Deck {
    "id": number,
    "name": string,
    "active": boolean,
    "card_count": number
}

export interface Card {
    "id": string,
    "deck": string,
    "front": string,
    "back": string,
    "current_box": number
}

export interface Box {
    "presented": Array<Card>,
    "unpresented": Array<Card>
}

export interface Session {
    "started": Date,
    "finished": Date,
    "cards_known": number,
    "cards_unknown": number
}

export interface SessionInfo {
    "ago": string,
    "duration": string,
    "cards_known": number,
    "cards_unknown": number
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
