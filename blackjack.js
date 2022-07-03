
let requestNewDeck = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count="
let drawCardFromDeck = "https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count="



$('#newDeckBtn').click(function () {
   callDeckOfCards();
});

callDeckOfCards();

deckIds = [];



function callDeckOfCards () {
    const request = {"url": requestNewDeck + 1, "method": "GET"}
    $.ajax(request).done(function (data) {
        console.log(data.deck_id);
        $('#deckId').text(data.deck_id);
        deckIds.push(data.deck_id);

    });

}


// setTimeout(function (){
//     console.log(deckIds);
//
//     $('#drawCardFromDeck').click(function() {
//         drawCardsFromDeck(deckIdTEMP)
//     });
//
//
// }, 500)


$('#newDeckBtn').click(function () {
    location.reload();
});



$('#defeatButton').click(function () {
    alert("Loser!!!!");
    location.reload();
});



const mapToDOM = (deck) => `<div>
<img src="${deck.image}" style="height: 220px; ">
</div>`



// $('#drawCardFromDeck').click(function() {
//     drawCardsFromDeck(deckIdTEMP)
// });

const deckIdTEMP =
    "7rg4ekudged7";


const playerValue = [];
const cpuValue = [];

let clickCountSkip = 0;

setTimeout(function (){
    console.log(deckIds);

    $('#drawCardFromDeck').click(function() {
        drawCardsFromDeck(deckIds[0]);
    });


    $('#skip').click(function () {
        const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
        const playerSum =  playerValue.reduce((partialSum, a) => partialSum + a, 0);
        if (sum >= 17 && playerSum >= 17 && playerSum > sum) {
            alert("Opponent surrenders!  You WIN!");
            windowReload();
        }
        if (clickCountSkip !== 0 && playerSum > 17) {
            cpuDrawsCard(deckIds[0]);
            clickCountSkip++;
        }

        if (clickCountSkip === 0) {
            cpuDrawsCard(deckIds[0]);
            clickCountSkip++;
        } else {
            alert("It's your turn");
            $('#defeatButton').css("visibility", 'unset');
        }
    });


}, 500);



// $('#skip').click(function () {
//     const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
//     const playerSum =  playerValue.reduce((partialSum, a) => partialSum + a, 0);
//     if (sum >= 17 && playerSum >= 17 && playerSum > sum) {
//         alert("Opponent surrenders!  You WIN!")
//         windowReload()
//     }
//     if (clickCountSkip !== 0 && playerSum > 17) {
//         cpuDrawsCard(deckIdTEMP);
//         clickCountSkip++
//     }
//
//     if (clickCountSkip === 0) {
//         cpuDrawsCard(deckIdTEMP);
//         clickCountSkip++
//     } else {
//         alert("It's your turn")
//         $('#defeatButton').css("visibility", 'unset')
//     }
// });

function cpuDrawsCard (deckId) {
    $('#playerContainer').removeClass('containerGlow')
    $('#cpuContainer').addClass('containerGlow')
    setTimeout(function () {
        const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
        const playerSum =  playerValue.reduce((partialSum, a) => partialSum + a, 0);
        if (sum < 17) {
            const request = {"url": "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=" + 1, "method": "GET"}
            $.ajax(request).done(function (data) {
                const cpuDraw = data.cards.map(mapToDOM);
                $('#cpuOutput').append(cpuDraw);
                cpuValue.push(convertRoyalCards(data.cards[0].value));
                const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
                console.log(sum);
                $('#cpuScore').text(sum);
                if (sum > 21) {
                    alert("Winner!!!");
                    windowReload();


                }
                if (sum === 21) {
                    alert("You lose!");
                    windowReload();

                }
                $('#cpuContainer').removeClass('containerGlow');
                $('#playerContainer').addClass('containerGlow');

            });
        } else if (sum >= 17 && playerSum >= 17 && playerSum > sum) {
            alert("Opponent surrenders!  You WIN!");
            windowReload();
        }
        else if (sum > 20 && sum === playerSum) {
            alert("DRAW!!");
            windowReload();
        } else {
            alert("Opponent skipped their turn");
            $('#cpuContainer').removeClass('containerGlow');
            $('#playerContainer').addClass('containerGlow');
            $('#defeatButton').css("visibility", 'unset');
            clickCountSkip = 0;


        }
    }, 500);

}



function drawCardsFromDeck (deckId) {
    $('#playerContainer').removeClass('containerGlow');
    $('#cpuContainer').addClass('containerGlow');
    const request  = {"url":  "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=" + 1, "method": "GET"}
    $.ajax(request).done(function (data) {
        console.log(data);


        playerValue.push(convertRoyalCards(data.cards[0].value));
        const cardDrawn = data.cards.map(mapToDOM);
        $('#output').append(cardDrawn);

        const sum = playerValue.reduce((partialSum, a) => partialSum + a, 0);
        console.log(sum);
        $('#playerScore').text(sum);
        if(sum > 21) {
            alert("You lose!");
            windowReload();

        }
        if(sum === 21) {
            alert("Winner!!!");
            windowReload();

        }
        clickCountSkip = 0;



    }).then(function () {

        setTimeout(function () {
            const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
            if(sum < 18) {
                $.ajax(request).done(function (data) {
                    const cpuDraw = data.cards.map(mapToDOM);
                    $('#cpuOutput').append(cpuDraw);
                    cpuValue.push(convertRoyalCards(data.cards[0].value));
                    const sum = cpuValue.reduce((partialSum, a) => partialSum + a, 0);
                    console.log(sum);
                    $('#cpuScore').text(sum);
                        if (sum > 21) {
                            alert("Winner!!!");
                            windowReload();

                        }
                        if (sum === 21) {
                            alert("You lose!");
                            windowReload();

                        }

                    });
                } else {
                alert("Opponent skipped their turn");
            }
            $('#cpuContainer').removeClass('containerGlow');
            $('#playerContainer').addClass('containerGlow');
        }, 500);

    });




}

// Helper function

function windowReload () {
        location.reload();
}

function convertRoyalCards(card) {
    if(card === "ACE") {
        if (playerValue.reduce((partialSum, a) => partialSum + a, 0) < 11 || cpuValue.reduce((partialSum, a) => partialSum + a, 0) < 11) {
            return 11;
        } else {
            return 1;
        }
    }

    if (card === 'JACK' || card === 'QUEEN' || card === 'KING') {
        return 10;
    } else {
        return parseInt(card);
    }
}

