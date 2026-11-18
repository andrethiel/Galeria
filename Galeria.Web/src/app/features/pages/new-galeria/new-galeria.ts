import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { ClienteCreateRequest } from '../../../core/models/create/ClienteCreateRequest';
import { ClienteState } from '../../../core/state/cliente.state';
import { IconsComponent } from '../../../shared/icons/icons';
import { ModalComponent } from '../../../shared/modal/modal';
import { InputComponent } from '../../../shared/input/input';
import { FormModel } from '../../../core/models/FormModel';
import { GaleriaCreateRequest } from '../../../core/models/create/GaleriaCreateRequest';
import { GaleriaState } from '../../../core/state/galeria.state';
import { GaleriaSecaoState } from '../../../core/state/galeriaSecao.state';
import { DateTimePickerComponent } from '../../../shared/datetimepicket/datetimepicket';
import { addMonths, isValid, parse } from 'date-fns';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { ImagemService } from '../../../core/services/imagem.service';
import { ResponseHandlerService } from '../../../core/services/response-handler.service';
import { SecaoService } from '../../../core/services/secao.service';

type GallerySection = {
  id: number;
  name: string;
  files: File[];
  previewUrls: string[];
};

@Component({
  selector: 'app-new-galeria',
  imports: [
    FormsModule,
    IconsComponent,
    ModalComponent,
    InputComponent,
    DateTimePickerComponent,
    CommonModule,
  ],
  templateUrl: './new-galeria.html',
})
export class NewGaleria implements OnInit {
  formGaleria!: FormGroup<FormModel<GaleriaCreateRequest>>;
  galeriaState = inject(GaleriaState);
  dragActive = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  previewIndex: number | null = null;
  selectedIndexes = new Set<number>();
  draggingIndex: number | null = null;
  dragOverIndex: number | null = null;
  sections: GallerySection[] = [];
  activeSection = 0;
  settingsOpen = false;
  settingsTab: 'Geral' | 'Interações' | 'Downloads' = 'Geral';
  clientModalOpen = false;
  sectionModalOpen = false;
  sectionModalMode: 'add' | 'edit' = 'add';
  sectionName = '';
  editingSectionIndex: number | null = null;
  responseHandler = inject(ResponseHandlerService);
  cliente: ClienteCreateRequest = {
    nome: null,
    email: null,
    telefone: null,
  };

  constructor(
    route: ActivatedRoute,
    private readonly alert: AlertService,
    private readonly clienteState: ClienteState,
    private readonly galeriaSecaoState: GaleriaSecaoState,
    private readonly sessionStorage: SessionStorageService,
    private readonly imagemService: ImagemService,
    private readonly secaoService: SecaoService,
    private fb: FormBuilder,
  ) {
    this.restoreSessionData();
    this.loadClient();
    this.loadInitialSection();
    this.carregarImagensSalvas();

    route.queryParamMap.subscribe((params) => {
      this.settingsOpen = params.has('settings');
    });
  }

  ngOnInit(): void {
    this.formGaleria = this.fb.group<FormModel<GaleriaCreateRequest>>({
      guid: this.fb.control<string | null>(this.galeriaState.obter()[0]?.guid ?? null),
      dataPublicacao: this.fb.control<Date | null>(null, Validators.required),
      dataExpiracao: this.fb.control<Date | null>(null, Validators.required),
      slug: this.fb.control<string | null>(null, Validators.required),
    });

    this.formGaleria.controls.dataPublicacao.valueChanges.subscribe((dataPublicacao) => {
      this.setExpirationDate(dataPublicacao);
    });
  }

  onPublicationDateChange(dataPublicacao: string | null): void {
    this.setExpirationDate(dataPublicacao);
  }

  private setExpirationDate(dataPublicacao: Date | string | null): void {
    const publicationDate = this.toDate(dataPublicacao);
    const dataExpiracao = publicationDate ? addMonths(publicationDate, 2) : null;
    this.formGaleria.controls.dataExpiracao.setValue(dataExpiracao);
  }

  private toDate(value: Date | string | null): Date | null {
    if (!value) return null;
    if (value instanceof Date) return isValid(value) ? value : null;

    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    this.setFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFiles(Array.from(input.files ?? []));
  }

  addFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).filter((file) => file.type === 'image/jpeg');
    this.enviarImagens(files, false);
  }

  selectImage(index: number, event: MouseEvent): void {
    const multiSelect = event.ctrlKey || event.metaKey;

    if (multiSelect) {
      if (this.selectedIndexes.has(index)) {
        this.selectedIndexes.delete(index);
      } else {
        this.selectedIndexes.add(index);
      }
    } else {
      this.selectedIndexes = new Set([index]);
    }
  }

  createSections(): void {
    this.openAddSectionModal();
  }

  addSection(): void {
    this.syncActiveSection();
    this.openAddSectionModal();
  }

  editSection(index: number): void {
    const section = this.sections[index];
    if (!section) return;

    this.sectionModalMode = 'edit';
    this.editingSectionIndex = index;
    this.sectionName = section.name;
    this.sectionModalOpen = true;
  }

  saveSection(): void {
    const name = this.sectionName.trim();
    if (!name) return;

    if (this.sectionModalMode === 'edit' && this.editingSectionIndex !== null) {
      const index = this.editingSectionIndex;
      const section = this.sections[index];
      if (!section) return;

      this.secaoService.editar(section.id, name).subscribe({
        next: (response) => this.responseHandler.handle(response, (data) => {
          this.sections = this.sections.map((item, sectionIndex) =>
            sectionIndex === index ? { ...item, name: data.nome } : item,
          );
          this.galeriaSecaoState.atualizar(data);
          this.persistSessionData();
          this.closeSectionModal();
        }),
        error: (error) => this.responseHandler.handleErro(error),
      });
    } else {
      const galeriaId = this.galeriaState.obter()[0]?.id;
      if (!galeriaId) {
        this.alert.erro('A galeria ainda não está disponível.');
        return;
      }

      this.secaoService.cadastrar(galeriaId, name).subscribe({
        next: (response) => this.responseHandler.handle(response, (data) => {
          this.sections = [
            ...this.sections,
            { id: data.id, name: data.nome, files: [], previewUrls: [] },
          ];
          this.galeriaSecaoState.atualizar(data);
          this.activeSection = this.sections.length - 1;
          this.loadActiveSection();
          this.persistSessionData();
          this.closeSectionModal();
        }),
        error: (error) => this.responseHandler.handleErro(error),
      });
    }
  }

  closeSectionModal(): void {
    this.sectionModalOpen = false;
    this.sectionName = '';
    this.editingSectionIndex = null;
  }

  private openAddSectionModal(): void {
    this.sectionModalMode = 'add';
    this.editingSectionIndex = null;
    this.sectionName = '';
    this.sectionModalOpen = true;
  }

  removeSection(index: number): void {
    this.alert
      .confirmacao('Excluir seção?', 'As imagens desta seção serão removidas da organização atual.')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.sections = this.sections.filter((_, sectionIndex) => sectionIndex !== index);
        this.activeSection = Math.max(0, Math.min(this.activeSection, this.sections.length - 1));
        this.loadActiveSection();
      });
  }

  selectSection(index: number): void {
    if (index === this.activeSection) return;
    this.syncActiveSection();
    this.activeSection = index;
    this.loadActiveSection();
  }

  isSelected(index: number): boolean {
    return this.selectedIndexes.has(index);
  }

  deleteSelected(): void {
    this.alert
      .confirmacao(
        'Excluir imagens selecionadas?',
        `Você selecionou ${this.selectedIndexes.size} ${this.selectedIndexes.size === 1 ? 'imagem' : 'imagens'}.`,
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        const indexesToDelete = [...this.selectedIndexes].sort((a, b) => b - a);

        for (const index of indexesToDelete) {
          URL.revokeObjectURL(this.previewUrls[index]);
          this.selectedFiles.splice(index, 1);
          this.previewUrls.splice(index, 1);
        }

        this.selectedIndexes.clear();
        this.previewIndex = null;
        this.syncActiveSection();
      });
  }

  onDragStart(index: number, event: DragEvent): void {
    this.draggingIndex = index;
    this.dragOverIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onImageDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    if (this.draggingIndex !== null && this.draggingIndex !== index) {
      this.dragOverIndex = index;
    }
  }

  onImageDrop(index: number, event: DragEvent): void {
    event.preventDefault();
    const fromIndex = this.draggingIndex;

    if (fromIndex !== null && fromIndex !== index) {
      const [file] = this.selectedFiles.splice(fromIndex, 1);
      const [previewUrl] = this.previewUrls.splice(fromIndex, 1);
      this.selectedFiles.splice(index, 0, file);
      this.previewUrls.splice(index, 0, previewUrl);
    }

    this.draggingIndex = null;
    this.dragOverIndex = null;
    this.selectedIndexes.clear();
    this.syncActiveSection();
  }

  onDragEnd(): void {
    this.draggingIndex = null;
    this.dragOverIndex = null;
  }

  openPreview(index: number): void {
    this.previewIndex = index;
  }

  closePreview(): void {
    this.previewIndex = null;
  }

  nextPreview(): void {
    if (this.previewIndex === null || this.previewUrls.length < 2) return;
    this.previewIndex = (this.previewIndex + 1) % this.previewUrls.length;
  }

  previousPreview(): void {
    if (this.previewIndex === null || this.previewUrls.length < 2) return;
    this.previewIndex = (this.previewIndex - 1 + this.previewUrls.length) % this.previewUrls.length;
  }

  private setFiles(files: File[]): void {
    const wasEmpty = this.selectedFiles.length === 0 && this.sections.length === 0;
    const validFiles = files.filter((file) => file.type === 'image/jpeg');
    this.enviarImagens(validFiles, wasEmpty);
  }

  private enviarImagens(files: File[], abrirConfiguracoes: boolean): void {
    const galeriaId = this.galeriaState.obter()[0]?.id;
    const galeriaSecaoId =
      this.sections[this.activeSection]?.id ?? this.galeriaSecaoState.obter()[0]?.id;
    if (!galeriaId || !galeriaSecaoId) {
      this.alert.erro('A galeria e a seção precisam estar disponíveis para receber imagens.');
      return;
    }

    let configuracoesAbertas = false;
    for (const arquivo of files) {
      this.imagemService.enviar(galeriaId, galeriaSecaoId, arquivo).subscribe({
        next: (response) => {
          if (!response.success) {
            this.alert.erro(response.message || 'Não foi possível enviar a imagem.');
            return;
          }

          this.adicionarImagemAprovada(arquivo);

          if (abrirConfiguracoes && !configuracoesAbertas) {
            configuracoesAbertas = true;
            this.settingsOpen = true;
          }
        },
        error: (error) => {
          this.alert.erro(error?.error?.message ?? 'Não foi possível enviar a imagem.');
        },
      });
    }
  }

  private adicionarImagemAprovada(arquivo: File): void {
    this.selectedFiles = [...this.selectedFiles, arquivo];
    this.previewUrls = [...this.previewUrls, URL.createObjectURL(arquivo)];
    this.selectedIndexes.clear();

    if (this.sections.length === 0) {
      this.sections = [
        {
          id: 1,
          name: 'Untitled Section',
          files: [],
          previewUrls: [],
        },
      ];
      this.activeSection = 0;
    }

    this.syncActiveSection();
  }

  closeSettings(): void {
    this.settingsOpen = false;
  }

  saveSettings(): void {
    if (this.formGaleria.invalid) {
      this.formGaleria.markAllAsTouched();
      this.logErrosFormulario();
      return;
    }
    const form = this.formGaleria.getRawValue();
  }

  openClientModal(): void {
    this.loadClient();
    this.clientModalOpen = true;
  }

  closeClientModal(): void {
    this.clientModalOpen = false;
  }

  saveClient(): void {
    if (
      !this.cliente.nome?.trim() ||
      !this.cliente.email?.trim() ||
      !this.cliente.telefone?.trim()
    ) {
      return;
    }

    const currentClient = this.clienteState.obter()[0];
    if (currentClient) {
      this.clienteState.atualizar({
        ...currentClient,
        nome: this.cliente.nome.trim(),
        email: this.cliente.email.trim(),
        telefone: this.cliente.telefone.trim(),
      });
      this.persistSessionData();
    }

    this.clientModalOpen = false;
  }

  private loadClient(): void {
    const currentClient = this.clienteState.obter()[0];
    this.cliente = currentClient
      ? {
          nome: currentClient.nome,
          email: currentClient.email,
          telefone: currentClient.telefone ?? null,
        }
      : { nome: null, email: null, telefone: null };
  }

  private loadInitialSection(): void {
    const section = this.galeriaSecaoState.obter()[0];
    if (!section || this.sections.length > 0) return;

    this.sections = [
      {
        id: section.id,
        name: section.nome,
        files: [],
        previewUrls: [],
      },
    ];
  }

  private carregarImagensSalvas(): void {
    const galeriaId = this.galeriaState.obter()[0]?.id;
    const galeriaSecaoId = this.galeriaSecaoState.obter()[0]?.id;
    if (!galeriaId || !galeriaSecaoId) return;

    this.imagemService.listarPorSecao(galeriaId, galeriaSecaoId).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (imagens) => {
          this.previewUrls = imagens.map((imagem) => imagem.url);
          this.selectedFiles = imagens.map(
            (imagem) => new File([], imagem.nomeArquivo, { type: 'image/webp' }),
          );
          this.syncActiveSection();
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  private restoreSessionData(): void {
    const dados = this.sessionStorage.obterClienteGaleria();
    if (!dados) return;

    if (this.clienteState.obter().length === 0) {
      this.clienteState.atualizar(dados.cliente);
    }
    if (this.galeriaState.obter().length === 0) {
      this.galeriaState.atualizar(dados.galeria);
    }
    if (this.galeriaSecaoState.obter().length === 0) {
      this.galeriaSecaoState.atualizar(dados.galeriaSecao);
    }
  }

  private persistSessionData(): void {
    const cliente = this.clienteState.obter()[0];
    const galeria = this.galeriaState.obter()[0];
    const galeriaSecao = this.galeriaSecaoState.obter()[0];

    if (cliente && galeria && galeriaSecao) {
      this.sessionStorage.salvarClienteGaleria({ cliente, galeria, galeriaSecao });
    }
  }

  private syncActiveSection(): void {
    if (!this.sections[this.activeSection]) return;
    this.sections[this.activeSection].files = [...this.selectedFiles];
    this.sections[this.activeSection].previewUrls = [...this.previewUrls];
  }

  private loadActiveSection(): void {
    const section = this.sections[this.activeSection];
    this.selectedFiles = section ? [...section.files] : [];
    this.previewUrls = section ? [...section.previewUrls] : [];
    this.selectedIndexes.clear();
    this.previewIndex = null;
  }

  private logErrosFormulario() {
    Object.entries(this.formGaleria.controls).forEach(([nome, control]) => {
      if (control.invalid) {
        console.log(nome, control.errors);
      }
    });
  }
}
