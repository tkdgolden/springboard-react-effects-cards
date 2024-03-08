import { useEffect, useState } from 'react'
import axios from 'axios'
import Card from './Card.jsx'
import { v4 as uuid } from 'uuid'

function Deck() {
    const [cards, setCards] = useState([]);
    const [deck, setDeck] = useState();
    const [finished, setFinished] = useState(false);

    useEffect(function startNewDeck() {
        async function newDeck() {
            const deck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            setDeck(deck.data.deck_id);
        };
        newDeck();
    }, []);

    async function shuffleDeck() {
        await axios.get(`https://deckofcardsapi.com/api/deck/${deck}/shuffle/`);
        setCards([]);
        setFinished(false);
    };

    async function drawCard() {
        const newCards = await axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`);
        if (newCards.data.cards[0]) {
            const suit = newCards.data.cards[0].suit;
            const value = newCards.data.cards[0].value;
            setCards((cards) => [...cards, {suit: suit, value: value, key: uuid()}]);
        }
        else {
            setFinished(true);
        }
    };

    return (
        <>
            <button onClick={drawCard}>Draw Card</button>
            {cards.map(card => <Card suit={card.suit} value={card.value} key={card.key} />)}
            <button onClick={shuffleDeck}>Shuffle Deck</button>
            {finished && <p>Error: No more cards</p>}
        </>
    );
};

export default Deck
