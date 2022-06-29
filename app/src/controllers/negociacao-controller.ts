
import { domInjector } from '../decorator/dom-injection.js';
import { inspect } from '../decorator/inspect.js';
import { logarTempoDeExecucao } from '../decorator/logar-tempo-execucao.js';
import { DiasDaSemana } from '../enums/dias-da-semana.js';
import { Negociacao } from '../models/negociacao.js';
import { Negociacoes } from '../models/negociacoes.js';
import { NegociacoesService } from '../services/negociacoes-service.js';
import { MensagemView } from '../views/mensagem-view.js';
import { NegociacoesView } from '../views/negociacoes-view.js';

export class NegociacaoController {
    @domInjector('#data')
    private inputData: HTMLInputElement;
    @domInjector('#quantidade')
    private inputQuantidade: HTMLInputElement;
    @domInjector('#valor')
    private inputValor: HTMLInputElement;
    private negociacoes: Negociacoes;
    private negociacoesView: NegociacoesView;
    private mensagemView: MensagemView;
    private negociacaoService: NegociacoesService;

    constructor() {
        this.negociacoes = new Negociacoes();
        this.negociacoesView = new NegociacoesView('#negociacoesView');
        this.mensagemView = new MensagemView('#mensagemView');        
        this.negociacaoService = new NegociacoesService();
        this.negociacoesView.update(this.negociacoes);        
    }

    @inspect
    @logarTempoDeExecucao(true)
    public adiciona(): void {
        const negociacao = Negociacao.criaDe(
            this.inputData.value, 
            this.inputQuantidade.value,
            this.inputValor.value
        );

        console.log(negociacao.paraTexto());
        if (this.ehDiaUtil(negociacao.data)) {
            this.negociacoes.adiciona(negociacao);
            console.log(this.negociacoes.paraTexto());
            this.limparFormulario();
            this.atualizaView();            
        } else 
            this.mensagemView.update('Apenas negociações em dias úteis são aceitas');
    }

    public importarDados(): void {
        this.negociacaoService
            .obterNegociacoesDoDia()
            .then(negociacoesDeHoje => {
                return negociacoesDeHoje.filter(negociacaoDeHoje => {
                    return !this.negociacoes
                        .lista()
                        .some(negociacao => negociacao.ehIgual(negociacaoDeHoje));
                });
            })
            .then(negociacoesHoje => {
                for (let negociacao of negociacoesHoje)
                    this.negociacoes.adiciona(negociacao);
                this.negociacoesView.update(this.negociacoes);
            });        
    }

    private ehDiaUtil(data: Date) {
        return data.getDay() > DiasDaSemana.DOMINGO 
            && data.getDay() < DiasDaSemana.SABADO;
    }

    private limparFormulario(): void {
        this.inputData.value = '';
        this.inputQuantidade.value = '';
        this.inputValor.value = '';
        this.inputData.focus();
    }

    private atualizaView(): void {
        this.negociacoesView.update(this.negociacoes);
        this.mensagemView.update('Negociação adicionada com sucesso');
    }
}
