import { Imprimivel } from "./imprimivel.js";

export function imprimir(...objetos: Imprimivel[]) {
    for(let imprimivel of objetos) {
        console.log(imprimivel.paraTexto());
    }
}