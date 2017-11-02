import { Component, OnInit } from '@angular/core';
import { Cab_movimento, CabMovimentoService } from "../cab-movimento.service";
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumbComponent } from "../../bread-crumb/bread-crumb.component";
import { Integrante, IntegranteService } from "../../integrante/integrante.service";

@Component({
  selector: 'app-form-cab-movimento',
  templateUrl: './form-cab-movimento.component.html',
  styleUrls: ['./form-cab-movimento.component.css'],
  providers: [CabMovimentoService, IntegranteService]
})
export class FormCabMovimentoComponent implements OnInit {

  private model: Cab_movimento = new Cab_movimento()
  private integrantes: any
  private id: string

  constructor(
    private service: CabMovimentoService,
    private bd: BreadCrumbComponent,
    private intService: IntegranteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.load();

    this.carregaIntegrantes();

    this.route.params.subscribe(
      // Se existir um parâmetro id, significa que queremos editar
      // um objeto já existente
      params => {
      if(params['id']) { 
          this.id = params['id'];
          // Buscamos o objeto para edição
          this.service.obterPorId(this.id).subscribe(
            // O model com que iremos trabalhar não é mais um objeto vazio,
            // mas um objeto existente retornado pelo back-end
            (existente: Cab_movimento) => this.model = existente
          )
        }
      }
    )
  }

  public load(){
    this.bd.setBreads([{'nome': 'HOME'      , 'link': '/home'},
                       {'nome': 'MOVIMENTOS', 'link': '/movimentos'},
                       {'nome': 'CADASTRO'  , 'link': '/movimentos/novo'}]);
    this.bd.setHeader('Cadastro de Movimentos');
  }

  public carregaIntegrantes(){
    this.integrantes = this.intService.listarTodos();
  }

  enviar() {
    // Preservando o roteador para evitar a perda de referência ao objeto
    let roteador = this.router
    console.log('antes da função')
    this.service.salvar(this.model).subscribe(
      function (teste) {
        console.log('deu certo' + teste)
        roteador.navigate(['/movimentos'])
      },
      function(erro){
        console.log('deu errado')
        console.error(erro)
      }
    )
    console.log('depois da função')
  }
}