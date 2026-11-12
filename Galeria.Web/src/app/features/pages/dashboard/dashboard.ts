import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconsComponent } from '../../../shared/icons/icons';
import { Galerias } from '../../../shared/galerias/galerias';
import { GaleriaResponse } from '../../../core/models/GaleriaResponse';
import { ClientService } from '../../../core/services/client.service';
import { ModalComponent } from '../../../shared/modal/modal';
import { FormModel } from '../../../core/models/FormModel';
import { ClienteCreateRequest } from '../../../core/models/create/ClienteCreateRequest';
import { InputComponent } from '../../../shared/input/input';
import { ResponseHandlerService } from '../../../core/services/response-handler.service';
import { AlertService } from '../../../core/services/alert.service';
import { ClienteState } from '../../../core/state/cliente.state';
import { CommonModule } from '@angular/common';
import { GaleriaState } from '../../../core/state/galeria.state';
import { GaleriaService } from '../../../core/services/galeria.service';
import { GaleriaCreateRequest } from '../../../core/models/create/GaleriaCreateRequest';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, IconsComponent, Galerias, ModalComponent, InputComponent, CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  readonly galleries: GaleriaResponse[];

  constructor(
    private readonly router: Router,
    private readonly clientService: ClientService,
    private readonly galeriaService: GaleriaService,
    private fb: FormBuilder,
  ) {
    this.galleries = [
      {
        guid: '1',
        nome: 'My Gallery',
        image:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
      },
      {
        guid: '2',
        nome: 'Sample Organized into Sections',
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
      },
      {
        guid: '3',
        nome: 'Sample',
        image:
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
      },
    ];
  }

  searchTerm = '';
  searchOpen = false;
  filterOpen = false;
  selectedFilter = 'Nome da Galeria';
  clientModalOpen = false;
  responseHandler = inject(ResponseHandlerService);
  alert = inject(AlertService);
  clienteState = inject(ClienteState);
  galeriaState = inject(GaleriaState);

  clineteForm!: FormGroup<FormModel<ClienteCreateRequest>>;

  ngOnInit(): void {
    this.clineteForm = this.fb.group<FormModel<ClienteCreateRequest>>({
      nome: this.fb.control<string | null>(null, Validators.required),
      email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
      telefone: this.fb.control<string | null>(null),
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
    this.clientModalOpen = true;
  }

  closeClientModal(): void {
    this.clientModalOpen = false;
  }

  salvar(): void {
    if (this.clineteForm.invalid) {
      this.clineteForm.markAllAsTouched();
      this.logErrosFormulario();
      return;
    }
    const form = this.clineteForm.getRawValue();
    this.clientModalOpen = false;
    this.clientService.inserirCliente(form).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (dados) => {
          this.alert.sucesso('Cliente salvo com sucesso!');
          this.clienteState.atualizar(dados);
          this.galeriaCadastro(dados.id).subscribe({
            next: (galeriaResponse) => {
              this.responseHandler.handle(galeriaResponse, (galeria) => {
                this.galeriaState.atualizar(galeria);
                void this.router.navigate(['/new']);
              });
            },
            error: (error) => this.responseHandler.handleErro(error),
          });
        });
      },
      error: (error) => {
        this.responseHandler.handleErro(error);
        this.clientModalOpen = true;
      },
    });
  }

  private logErrosFormulario() {
    Object.entries(this.clineteForm.controls).forEach(([nome, control]) => {
      if (control.invalid) {
        console.log(nome, control.errors);
      }
    });
  }

  private galeriaCadastro(idcliente: number) {
    const galeria: GaleriaCreateRequest = {
      clienteId: idcliente,
      slug: null,
      dataPublicacao: null,
      dataExpiracao: null,
    };

    return this.galeriaService.cadastrarGaleria(galeria);
  }
}
