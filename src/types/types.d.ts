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

export interface Style {
    "backgroundColor": string,
    "color": string
}