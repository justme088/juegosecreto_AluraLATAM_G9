function AsignarTextoElemento(elemento, texto){
    document.querySelector(elemento).innerHTML = texto;
};

function anuncioJuego(mensaje, finalizado=false){
    setTimeout( () => {
        AsignarTextoElemento('p', mensaje);

        if(finalizado){
            botonReinicio.removeAttribute("disabled","");
            document.getElementById("valorUsuario").value = "";
            JuegoTerminado = true
        } else {
            botonIntento.removeAttribute("disabled","");
            cuadroDeTexto.removeAttribute("disabled","");
        }

    }, DemoraDeTiempo); 
};

function ReiniciarJuego(inicio=false){

    if (JuegoTerminado || inicio == true){
        botonReinicio.setAttribute("disabled","");
        document.getElementById("valorUsuario").value = "";
        contadorIntentos = 1;
        JuegoTerminado = false;
        
        //numeroSecreto = GenerarNumeroAleatorio();
        
        // Tuve que usar modo asíncrono porque luego me daba error por lo rápido que iba, me retornaba undefined.
        GenerarNumeroAleatorio().then(result => {
            numeroSecreto = result;
        });

        AsignarTextoElemento('p', "Ingresa un número entre 1 y 10");

        setTimeout( () => {
            AsignarTextoElemento('p', `Intento ${contadorIntentos}`); 
            anuncioJuego("Ingresa un número entre 1 y 10");
        }, DemoraDeTiempo);
    }
};

function intentoDeUsuario(){

    console.log(`${numeroSecreto}, ${listaNumeros}`);

    let numeroUsuario = parseInt(document.getElementById("valorUsuario").value);

    botonIntento.setAttribute("disabled",""); cuadroDeTexto.setAttribute("disabled","");
    
    if (!JuegoTerminado){
        (numeroUsuario == numeroSecreto) ? 
        anuncioJuego(`El número secreto era ${numeroSecreto} ¡Has ganado en ${contadorIntentos} ${(contadorIntentos == 1) ? "vez" : "veces"}!`,true) :// dos puntos
        (() => {
            (numeroUsuario > numeroSecreto) ?
                (setTimeout( () => {AsignarTextoElemento('p', `El número secreto es menor.`);}, DemoraDeTiempo)) :// dos puntos
                (setTimeout( () => {AsignarTextoElemento('p', `El número secreto es mayor.`);}, DemoraDeTiempo));
            
            setTimeout(() => {
                (contadorIntentos <= intentosMaximos) ?
                (() => {
                    setTimeout( () => {
                        AsignarTextoElemento('p', `Intento ${contadorIntentos}`); document.getElementById("valorUsuario").value = "";
                        anuncioJuego("Ingresa un número entre 1 y 10");
                    }, DemoraDeTiempo);
                })() :// dos puntos
                anuncioJuego(`Se ha alcanzando el número máximo de ${intentosMaximos} intentos`,true);
            }, DemoraDeTiempo);
            

            contadorIntentos++;

        })();

    }

};

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function GenerarNumeroAleatorio(){
    let numeroAleatorio = Math.floor(Math.random()*(NumeroMaximo))+1;
    numeroAleatorio = (numeroAleatorio > 10) ? 10 : numeroAleatorio;

    if(listaNumeros.length == NumeroMaximo) {
        listaNumeros = [numeroAleatorio];
        return numeroAleatorio;
    }
    
    if (listaNumeros.includes(numeroAleatorio)){
        await esperar(100); // Si no implementaba esto, las otras condiciones no eran evaluadas y continuaba llamando la funcion sin parar.
        return GenerarNumeroAleatorio();
    } else{
        listaNumeros.push(numeroAleatorio);
        return numeroAleatorio;
    }
    
};

var contadorIntentos = 1;
var intentosMaximos = 3;
var JuegoTerminado = false;
var DemoraDeTiempo = 1000;
var NumeroMaximo = 10;
var listaNumeros = [];
var numeroSecreto = 0;
var botonIntento = document.querySelector(".container__boton:not(#reiniciar)");
var botonReinicio = document.querySelector("#reiniciar");
var cuadroDeTexto = document.getElementById("valorUsuario");

AsignarTextoElemento('h1', "¡Juego del Número Secreto!");
ReiniciarJuego(true);
