import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Galerias } from '../../../shared/galerias/galerias';
import { ClienteService } from '../../../core/services/cliente.service';
import { ModalComponent } from '../../../shared/modal/modal';
import { FormModel } from '../../../core/models/FormModel';
import { ClienteCreateRequest } from '../../../core/models/create/ClienteCreateRequest';
import { InputComponent } from '../../../shared/input/input';
import { ResponseHandlerService } from '../../../core/services/response-handler.service';
import { AlertService } from '../../../core/services/alert.service';
import { ClienteState } from '../../../core/state/cliente.state';
import { CommonModule } from '@angular/common';
import { GaleriaState } from '../../../core/state/galeria.state';
import { GaleriaSecaoState } from '../../../core/state/galeriaSecao.state';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { GaleriaService } from '../../../core/services/galeria.service';
import { SelectOption } from '../../../core/models/response/SelectOption';
import { SelectComponent } from '../../../shared/select/select';
import { GaleriaResponse } from '../../../core/models/response/GaleriaResponse';
import { GaleriaRequest } from '../../../core/models/GaleriaRequest';
import { DateTimePickerComponent } from '../../../shared/datetimepicket/datetimepicket';
import { ButtonComponent } from '../../../shared/button/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    Galerias,
    ModalComponent,
    InputComponent,
    CommonModule,
    SelectComponent,
    DateTimePickerComponent,
    ButtonComponent,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  galerias: GaleriaResponse[] = [];
  formFiltrar!: FormGroup<FormModel<GaleriaRequest>>;

  constructor(
    private readonly router: Router,
    private readonly clientService: ClienteService,
    private readonly sessionStorage: SessionStorageService,
    private readonly galeriaService: GaleriaService,
    private fb: FormBuilder,
  ) {}

  searchTerm = '';
  clientModalOpen = false;
  responseHandler = inject(ResponseHandlerService);
  alert = inject(AlertService);
  clienteState = inject(ClienteState);
  galeriaState = inject(GaleriaState);
  galeriaSecaoState = inject(GaleriaSecaoState);
  clienteForm!: FormGroup<FormModel<ClienteCreateRequest>>;
  tipoEnsaio: SelectOption[] = [];
  private paginaAtual = 0;
  private readonly tamanhoPagina = 20;
  carregandoGalerias = false;
  temMaisGalerias = true;

  ngOnInit(): void {
    this.clienteForm = this.fb.group<FormModel<ClienteCreateRequest>>({
      nome: this.fb.control<string | null>(null, Validators.required),
      email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
      telefone: this.fb.control<string | null>(null),
      tipoEnsaio: this.fb.control<number | null>(null, Validators.required),
    });

    this.formFiltrar = this.fb.group<FormModel<GaleriaRequest>>({
      nomeCliente: this.fb.control<string | null>(null),
      dataPublicacao: this.fb.control<string | null>(null),
      tipoEnsaio: this.fb.control<number | null>(null),
    });
    this.carregarEnsaios();
    this.carregarGalerias();
  }

  private carregarGalerias(pagina = 1): void {
    if (this.carregandoGalerias || (pagina > 1 && !this.temMaisGalerias)) return;

    this.carregandoGalerias = true;
    this.galeriaService.listarGalerias(pagina, this.tamanhoPagina).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (galerias) => {
          const novasGalerias = galerias.items.map((galeria) => ({
            ...galeria,
            nome: galeria.slug || `Galeria ${galeria.id}`,
            image: galeria.imagemPrincipal || '',
          }));

          if (pagina === 1) {
            this.galerias.splice(0, this.galerias.length, ...novasGalerias);
          } else {
            this.galerias.push(...novasGalerias);
          }

          this.paginaAtual = galerias.page;
          this.temMaisGalerias = galerias.hasNextPage;
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
      complete: () => {
        this.carregandoGalerias = false;
      },
    });
  }

  @HostListener('window:scroll')
  aoRolar(): void {
    const distanciaAteOFim =
      document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);

    if (distanciaAteOFim < 300) {
      this.carregarGalerias(this.paginaAtual + 1);
    }
  }

  filtrarGalerias() {
    const filtros = this.formFiltrar.getRawValue();
    const possuiFiltro = Object.values(filtros).some((valor) =>
      typeof valor === 'string' ? valor.trim().length > 0 : valor !== null && valor !== undefined,
    );

    if (!possuiFiltro) {
      this.alert.erro('Preencha pelo menos um filtro antes de pesquisar.');
      return;
    }

    this.galeriaService.filtrarGaleria(filtros).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (galerias) => {
          const galeriasFiltradas = galerias.items.map((galeria) => ({
            ...galeria,
            nome: galeria.slug || `Galeria ${galeria.id}`,
            image: galeria.imagemPrincipal || '',
          }));

          this.galerias.splice(0, this.galerias.length, ...galeriasFiltradas);
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  carregarEnsaios() {
    this.clientService.obterTipoEnsaio().subscribe({
      next: (response) => (this.tipoEnsaio = response.success ? response.data : []),
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  removerGaleria(id: number): void {
    const index = this.galerias.findIndex((galeria) => galeria.id === id);
    if (index !== -1) {
      this.galerias.splice(index, 1);
    }

    this.galeriaState.excluir(id);
    this.galeriaSecaoState.limpar();
  }

  openClientModal(): void {
    this.clientModalOpen = true;
  }

  closeClientModal(): void {
    this.clientModalOpen = false;
  }

  salvar(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.logErrosFormulario();
      return;
    }
    const form = this.clienteForm.getRawValue();
    this.clientModalOpen = false;
    this.clientService.inserirClienteComGaleria(form).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (dados) => {
          this.alert.sucesso('Cliente salvo com sucesso!');
          this.clienteState.atualizar(dados.cliente);
          this.galeriaState.atualizar(dados.galeria);
          this.galeriaSecaoState.atualizar(dados.galeriaSecao);
          this.sessionStorage.salvarClienteGaleria(dados);
          void this.router.navigate(['/new']);
        });
      },
      error: (error) => {
        this.responseHandler.handleErro(error);
        this.clientModalOpen = true;
      },
    });
  }

  private logErrosFormulario() {
    Object.entries(this.clienteForm.controls).forEach(([nome, control]) => {
      if (control.invalid) {
        console.log(nome, control.errors);
      }
    });
  }
}
