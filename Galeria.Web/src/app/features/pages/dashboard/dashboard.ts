import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconsComponent } from '../../../shared/icons/icons';
import { Galerias } from '../../../shared/galerias/galerias';
import { GaleriaResponse } from '../../../core/models/GaleriaResponse';
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

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    IconsComponent,
    Galerias,
    ModalComponent,
    InputComponent,
    CommonModule,
    SelectComponent,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  readonly galleries: GaleriaResponse[] = [];

  constructor(
    private readonly router: Router,
    private readonly clientService: ClienteService,
    private readonly sessionStorage: SessionStorageService,
    private readonly galeriaService: GaleriaService,
    private fb: FormBuilder,
  ) {}

  searchTerm = '';
  searchOpen = false;
  filterOpen = false;
  selectedFilter = 'Nome da Galeria';
  clientModalOpen = false;
  responseHandler = inject(ResponseHandlerService);
  alert = inject(AlertService);
  clienteState = inject(ClienteState);
  galeriaState = inject(GaleriaState);
  galeriaSecaoState = inject(GaleriaSecaoState);
  clienteForm!: FormGroup<FormModel<ClienteCreateRequest>>;
  tipoEnsaio: SelectOption[] = [];

  ngOnInit(): void {
    this.clienteForm = this.fb.group<FormModel<ClienteCreateRequest>>({
      nome: this.fb.control<string | null>(null, Validators.required),
      email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
      telefone: this.fb.control<string | null>(null),
      tipoEnsaio: this.fb.control<number | null>(null, Validators.required),
    });

    this.carregarGalerias();
  }

  private carregarGalerias(): void {
    this.galeriaService.listarGalerias().subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (galerias) => {
          this.galleries.splice(
            0,
            this.galleries.length,
            ...galerias.map((galeria) => ({
              ...galeria,
              nome: galeria.slug || `Galeria ${galeria.id}`,
               image: galeria.imagemPrincipal || '',
            })),
          );
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

  get filteredGalleries(): GaleriaResponse[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();

    if (!term) {
      return this.galleries;
    }

    return this.galleries.filter((gallery) => gallery.nome.toLocaleLowerCase().includes(term));
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      this.filterOpen = false;
    }
  }

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
    if (this.filterOpen) {
      this.searchOpen = false;
    }
  }

  chooseFilter(filter: string): void {
    this.selectedFilter = filter;
    this.filterOpen = false;
  }

  openClientModal(): void {
    this.carregarEnsaios();
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
