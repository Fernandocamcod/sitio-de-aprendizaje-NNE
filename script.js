document.addEventListener('DOMContentLoaded', () => {
    // --- Sección: Formar Palabras (Lectura) ---
    const formarPalabrasArea = document.getElementById('formar-palabras');
    if (formarPalabrasArea) {
        const palabraObjetivoDiv = formarPalabrasArea.querySelector('.palabra-objetivo');
        const letrasDisponiblesDiv = formarPalabrasArea.querySelector('.letras-disponibles');
        const botonVerificarPalabra = formarPalabrasArea.querySelector('.boton-verificar');
        const retroalimentacionPalabra = formarPalabrasArea.querySelector('.retroalimentacion');
        const audioGato = document.getElementById('audio-gato');

        let palabraActual = palabraObjetivoDiv.dataset.palabra; // Obtiene la palabra del data-palabra
        let letrasArrastrables = [];

        function generarLetras(palabra) {
            letrasDisponiblesDiv.innerHTML = '';
            palabraObjetivoDiv.innerHTML = ''; // Limpiar el área de destino

            // Generar divs vacíos para la palabra objetivo
            for (let i = 0; i < palabra.length; i++) {
                const spanVacio = document.createElement('span');
                spanVacio.classList.add('slot-letra');
                spanVacio.style.width = '40px'; // Ajusta el tamaño del slot
                spanVacio.style.height = '40px';
                spanVacio.style.border = '1px dashed #ccc';
                spanVacio.style.margin = '5px';
                spanVacio.style.display = 'inline-flex';
                spanVacio.style.justifyContent = 'center';
                spanVacio.style.alignItems = 'center';
                spanVacio.dataset.index = i; // Para saber qué posición ocupa
                palabraObjetivoDiv.appendChild(spanVacio);
            }

            const letrasMezcladas = palabra.split('').sort(() => Math.random() - 0.5);

            letrasMezcladas.forEach(letra => {
                const letraDiv = document.createElement('div');
                letraDiv.classList.add('letra-arrastrable');
                letraDiv.textContent = letra;
                letraDiv.setAttribute('draggable', true);
                letrasArrastrables.push(letraDiv);
                letrasDisponiblesDiv.appendChild(letraDiv);
            });

            addDragAndDropListeners();
        }

        function addDragAndDropListeners() {
            letrasArrastrables.forEach(letra => {
                letra.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.textContent);
                    e.dataTransfer.effectAllowed = 'move';
                    e.target.classList.add('dragging');
                });

                letra.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });
            });

            palabraObjetivoDiv.querySelectorAll('.slot-letra').forEach(slot => {
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Permite soltar
                    e.dataTransfer.dropEffect = 'move';
                    slot.classList.add('drag-over');
                });

                slot.addEventListener('dragleave', (e) => {
                    slot.classList.remove('drag-over');
                });

                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('drag-over');
                    const data = e.dataTransfer.getData('text/plain');
                    const draggedElement = document.querySelector('.dragging');

                    if (draggedElement && !slot.hasChildNodes()) { // Solo si el slot está vacío
                        slot.appendChild(draggedElement);
                        draggedElement.style.position = 'static'; // Resetear posición si se usó CSS
                        draggedElement.style.margin = '0'; // Quitar margen para que encaje bien
                    }
                });
            });
        }

        botonVerificarPalabra.addEventListener('click', () => {
            let palabraFormada = '';
            const slots = Array.from(palabraObjetivoDiv.querySelectorAll('.slot-letra'));
            slots.sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index)); // Ordenar por índice

            slots.forEach(slot => {
                if (slot.firstElementChild) {
                    palabraFormada += slot.firstElementChild.textContent;
                }
            });

            if (palabraFormada.toUpperCase() === palabraActual.toUpperCase()) {
                retroalimentacionPalabra.textContent = '¡Correcto! 🎉';
                retroalimentacionPalabra.classList.remove('incorrecta');
                retroalimentacionPalabra.classList.add('correcta');
                if (audioGato) audioGato.play(); // Reproduce el sonido si es correcto
            } else {
                retroalimentacionPalabra.textContent = '¡Inténtalo de nuevo! 🤔';
                retroalimentacionPalabra.classList.remove('correcta');
                retroalimentacionPalabra.classList.add('incorrecta');
            }
        });

        // Inicializar el ejercicio
        generarLetras(palabraActual);
    }


    // --- Sección: Contando Objetos (Matemáticas) ---
    const contarObjetosArea = document.getElementById('contar-objetos');
    if (contarObjetosArea) {
        const inputManzanas = document.getElementById('input-manzanas');
        const botonVerificarContar = contarObjetosArea.querySelector('.boton-verificar');
        const retroalimentacionContar = contarObjetosArea.querySelector('.retroalimentacion');
        const respuestaCorrecta = 5; // Asumimos que hay 5 manzanas en la imagen

        botonVerificarContar.addEventListener('click', () => {
            const respuestaUsuario = parseInt(inputManzanas.value);

            if (!isNaN(respuestaUsuario) && respuestaUsuario === respuestaCorrecta) {
                retroalimentacionContar.textContent = '¡Excelente! ¡Lo lograste! ✨';
                retroalimentacionContar.classList.remove('incorrecta');
                retroalimentacionContar.classList.add('correcta');
            } else {
                retroalimentacionContar.textContent = 'Casi... ¡Sigue practicando! 😉';
                retroalimentacionContar.classList.remove('correcta');
                retroalimentacionContar.classList.add('incorrecta');
            }
        });
    }

    // --- Sección: Juego de Memoria ---
    const memoriaGameArea = document.getElementById('memoria-game');
    if (memoriaGameArea) {
        const cardValues = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍎', '🍌', '🍇', '🍊', '🍓']; // Pares
        let flippedCards = [];
        let matchedCards = [];
        let lockBoard = false;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function createBoard() {
            memoriaGameArea.innerHTML = '';
            const shuffledValues = shuffle(cardValues);

            shuffledValues.forEach(value => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.value = value;

                const cardInner = document.createElement('div');
                cardInner.classList.add('card-inner');

                const cardFront = document.createElement('div');
                cardFront.classList.add('card-front');
                cardFront.textContent = '?'; // Parte trasera de la tarjeta

                const cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = value; // Contenido de la tarjeta

                cardInner.appendChild(cardFront);
                cardInner.appendChild(cardBack);
                card.appendChild(cardInner);

                card.addEventListener('click', flipCard);
                memoriaGameArea.appendChild(card);
            });
        }

        function flipCard() {
            if (lockBoard) return;
            if (this === flippedCards[0]) return; // Evitar doble clic en la misma tarjeta

            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                lockBoard = true;
                checkForMatch();
            }
        }

        function checkForMatch() {
            const [card1, card2] = flippedCards;
            const isMatch = card1.dataset.value === card2.dataset.value;

            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            flippedCards.forEach(card => {
                card.removeEventListener('click', flipCard);
                card.classList.add('matched');
            });
            matchedCards.push(...flippedCards);
            resetBoard();
        }

        function unflipCards() {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                });
                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [flippedCards, lockBoard] = [[], false];

            if (matchedCards.length === cardValues.length) {
                setTimeout(() => {
                    alert('¡Felicidades! ¡Encontraste todas las parejas! 🎉');
                    createBoard(); // Reiniciar el juego
                }, 500);
            }
        }

        createBoard();
    }
});