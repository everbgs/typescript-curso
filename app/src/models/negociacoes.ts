import { Modelo } from '../interfaces/modelo.js';
import { Negociacao } from './negociacao.js';

export class Negociacoes implements Modelo<Negociacoes> {   

    private negociacoes: Negociacao[] = [];  
   

    public adiciona(negociacao: Negociacao) {
        this.negociacoes.push(negociacao);
    }

    public lista(): readonly Negociacao[] {
        return this.negociacoes;
    }

    public paraTexto(): String {
        return JSON.stringify(this.negociacoes, null, 2);
    }   

    public ehIgual(object: Negociacoes): boolean {
        return JSON.stringify(object.lista()) === JSON.stringify(this.negociacoes);
    }
}
