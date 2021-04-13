const miModulo = (() => {

    let deck = [];
    const tipos = ["C", "D", "H", "S"],
         especiales = ["A", "J", "Q", "K"];

    let puntosJugadores = [];

    //Referencias del HTML
    const btnPedir = document.querySelector("#btnPedir"),
          btnDetener = document.getElementById("btnDetener"),
          btnNuevo = document.querySelector("#btnNuevo");

    const divCartasJugadores = document.querySelectorAll(".divCartas"),
          puntosHTML = document.querySelectorAll("small");

    const inicializarJuego = ( numJugadores = 2) =>{
        deck = crearDeck();

        puntosJugadores = [];
        for(let i=0; i<numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach(elem => elem.innerText = "");

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    } 

    const crearDeck = () => {

        deck = [];
        for( let i = 2; i<=10; i++ ){
            for(let tipo of tipos){
                deck.push(i + tipo);
            }
        }

        for( let tipo of tipos ){
            for(let esp of especiales){
                deck.push(esp + tipo);
            }
        }

        return _.shuffle(deck);
    }

    //Funcion para tomar una carta
    const pedirCarta = () =>{

        if( deck.length === 0){
            throw "No hay cartas en el deck";
        }

        return deck.pop();
    }

    const valorCarta = (carta) =>{

        const valor = carta.substring(0, carta.length-1);
        return (isNaN( valor )) ?
                ( valor === "A")? 11 : 10
                : +valor;
    }

    //Turno el 0= primer jugador yel último será la computadora
    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) =>{

        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("cartas");
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            if(puntosComputadora === puntosMinimos){
                alert("You draw with computer");
            }else if(puntosMinimos > 21){
                alert("Oh no, computer win :(");
            }else if(puntosComputadora > 21){
                alert("Congrats, you win!!");
            }else if(puntosMinimos > puntosComputadora){
                alert("Congrats, you win!!");
            }else if(puntosMinimos < puntosComputadora){
                alert("Oh no, computer win :(");
            }    
        }, 100);
    }

    //Turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length-1 );
            crearCarta(carta, puntosJugadores.length-1);

        } while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    //Eventos
    btnPedir.addEventListener("click", () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        
        if(puntosJugador> 21){
            console.warn("Game Over, Try again!!");
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }else if(puntosJugador === 21){
            console.warn ("Congrats, you win!!");
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });

    btnDetener.addEventListener("click", () => {
        const puntosJugador = puntosJugadores[0];

        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora( puntosJugador );
    });

    btnNuevo.addEventListener("click", () => {
        
        inicializarJuego();
        
    });

    return {
        nuevoJuego: inicializarJuego
    }; 

})();


