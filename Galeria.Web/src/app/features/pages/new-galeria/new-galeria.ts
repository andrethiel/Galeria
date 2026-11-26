import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { GaleriaService } from '../../../core/services/galeria.service';
import { GaleriaImagemResponse } from '../../../core/models/response/GaleriaImagemResponse';
import {
  catchError,
  concatMap,
  EMPTY,
  finalize,
  filter,
  firstValueFrom,
  from,
  map,
  tap,
} from 'rxjs';
import { ClienteEditRequest } from '../../../core/models/edit/ClienteEditRequest';
import { ClienteService } from '../../../core/services/cliente.service';
import { ButtonComponent } from '../../../shared/button/button';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { GaleriaEditRequest } from '../../../core/models/edit/GaleriaEditRequest';
import { GaleriaImagemState } from '../../../core/state/imagem.state';

type GallerySection = {
  id: number;
  name: string;
  files: File[];
  previewUrls: string[];
  imageIds: number[];
  primaryImageId: number | null;
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
    ButtonComponent,
  ],
  templateUrl: './new-galeria.html',
})
export class NewGaleria implements OnInit {
  formGaleria!: FormGroup<FormModel<GaleriaEditRequest>>;
  formCliente!: FormGroup<FormModel<ClienteEditRequest>>;
  dragActive = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  imageIds: number[] = [];
  primaryImageId: number | null = null;
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
  uploadingImages = false;
  uploadedImages = 0;
  totalImages = 0;
  uploadProgress = 0;
  currentImageProgress = 0;

  get galeriaPublicada(): boolean {
    return this.galeriaState.obter()[0]?.status === 2;
  }

  constructor(
    route: ActivatedRoute,
    private readonly alert: AlertService,
    private readonly clienteState: ClienteState,
    private readonly clienteService: ClienteService,
    private readonly galeriaSecaoState: GaleriaSecaoState,
    private readonly sessionStorage: SessionStorageService,
    private readonly imagemService: ImagemService,
    private readonly secaoService: SecaoService,
    private readonly galeriaService: GaleriaService,
    private readonly fb: FormBuilder,
    private readonly responseHandler: ResponseHandlerService,
    private readonly galeriaState: GaleriaState,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router,
    private readonly imagemStates: GaleriaImagemState,
  ) {
    this.inicializarFormularios();
    this.restoreSessionData();
    this.loadClient();

    route.queryParamMap.subscribe((params) => {
      this.settingsOpen = params.has('settings');

      const galeriaId = Number(params.get('galeriaId'));
      if (galeriaId !== 0) {
        this.carregarGaleriaSelecionada(galeriaId);
      } else {
        this.inicializarDadosGaleria();
      }
    });
  }

  ngOnInit(): void {
    this.formGaleria.controls.dataPublicacao.valueChanges.subscribe((dataPublicacao) => {
      this.setExpirationDate(dataPublicacao);
    });
  }

  private inicializarFormularios(): void {
    const cliente = this.clienteState.obter();
    this.formCliente = this.fb.group<FormModel<ClienteEditRequest>>({
      id: this.fb.control<number>(cliente?.id ?? 0, { nonNullable: true }),
      nome: this.fb.control<string | null>(cliente?.nome ?? null),
      email: this.fb.control<string | null>(cliente?.email ?? null),
      telefone: this.fb.control<string | null>(cliente?.telefone ?? null),
    });

    this.formGaleria = this.fb.group<FormModel<GaleriaEditRequest>>({
      id: this.fb.control<number | null>(this.galeriaState.obter()[0]?.id ?? null),
      dataPublicacao: this.fb.control<Date | null>(null, Validators.required),
      dataExpiracao: this.fb.control<Date | null>(null, Validators.required),
      slug: this.fb.control<string | null>(null, Validators.required),
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

  editarCliente(): void {
    if (this.formCliente.invalid) {
      this.formCliente.markAllAsTouched();
      return;
    }

    var cliente = this.formCliente.getRawValue();

    this.clienteService.editarCliente(cliente).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (data) => {
          this.clienteState.atualizar(data);
          this.alert.sucesso('Cliente atualizado com sucesso.');
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  async imagemPrincipal(): Promise<void> {
    if (this.selectedIndexes.size !== 1) {
      this.alert.erro('Selecione apenas uma imagem para defini-la como principal.');
      return;
    }

    const [index] = this.selectedIndexes;
    const idImagem = this.imageIds[index];
    if (!idImagem) return;

    const urlImagem = this.previewUrls[index];
    if (!urlImagem) {
      this.alert.erro('Não foi possível identificar a orientação da imagem.');
      return;
    }

    try {
      const dimensoes = await this.obterDimensoesImagem(urlImagem);
      if (dimensoes.largura <= dimensoes.altura) {
        this.alert.erro('A imagem principal precisa estar na horizontal.');
        return;
      }
    } catch {
      this.alert.erro('Não foi possível validar a orientação da imagem.');
      return;
    }

    this.imagemService.imagemPrincipal(idImagem).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (data) => {
          this.primaryImageId = data.id;
          this.imagemStates.definirPrincipal(data.id);
          this.syncActiveSection();
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  private obterDimensoesImagem(url: string): Promise<{ largura: number; altura: number }> {
    return new Promise((resolve, reject) => {
      const imagem = new Image();
      imagem.onload = () => resolve({ largura: imagem.naturalWidth, altura: imagem.naturalHeight });
      imagem.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
      imagem.src = url;
    });
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
        next: (response) =>
          this.responseHandler.handle(response, (data) => {
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
        next: (response) =>
          this.responseHandler.handle(response, (data) => {
            this.sections = [
              ...this.sections,
              {
                id: data.id,
                name: data.nome,
                files: [],
                previewUrls: [],
                imageIds: [],
                primaryImageId: null,
              },
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

  openModalConfig() {
    var galeria = this.galeriaState.obter()[0];
    this.formGaleria.controls.slug.setValue(galeria.slug);
    this.formGaleria.controls.dataPublicacao.setValue(galeria.dataPublicacao);
    this.formGaleria.controls.dataExpiracao.setValue(galeria.dataExpiracao);
    this.settingsOpen = true;
  }

  publicarGaleria() {
    const galeria = this.galeriaState.obter()[0];
    const existeImagemPrincipal = this.imagemStates
      .obter()
      .some((imagem) => imagem.imagemPrincipal === true);

    if (!existeImagemPrincipal) {
      this.alert.erro('Defina uma imagem principal antes de publicar a galeria.');
      return;
    }

    if (galeria.slug == null && galeria.dataPublicacao == null && galeria.dataExpiracao == null) {
      this.settingsOpen = true;
    }

    this.galeriaService.publicarGaleria(galeria.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.galeriaState.atualizar({ ...galeria, status: 2 });
          this.alert.sucesso('Galeria publicada com sucesso. Você será redirecionado ao inico');
          this.router.navigate(['/']);
        }
      },
      error: (error) => this.responseHandler.erro(error),
    });
  }

  private marcarGaleriaComoRascunho(): void {
    const galeria = this.galeriaState.obter()[0];
    if (!galeria || galeria.status !== 2) return;

    this.galeriaState.atualizar({ ...galeria, status: 1 });
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

        const section = this.sections[index];
        if (!section) return;

        this.secaoService.excluir(section.id).subscribe({
          next: (response) => {
            this.responseHandler.handle(response, () => {
              this.sections = this.sections.filter((_, sectionIndex) => sectionIndex !== index);
              this.galeriaSecaoState.excluir(section.id);
              this.activeSection = Math.max(
                0,
                Math.min(this.activeSection, this.sections.length - 1),
              );
              this.loadActiveSection();
              this.persistSessionData();
            });
          },
          error: (error) => this.responseHandler.handleErro(error),
        });
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

  isSelectedImagePrincipal(): boolean {
    if (this.selectedIndexes.size !== 1) return false;

    const [index] = this.selectedIndexes;
    return this.imageIds[index] === this.primaryImageId;
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

        void this.excluirImagens(indexesToDelete);
      });
  }

  private async excluirImagens(indexes: number[]): Promise<void> {
    const galeriaId = this.galeriaState.obter()[0]?.id;
    if (!galeriaId) return;

    for (const index of indexes) {
      const imageId = this.imageIds[index];
      if (!imageId) continue;

      try {
        const response = await firstValueFrom(this.imagemService.excluir(galeriaId, imageId));
        if (!response.success) {
          this.alert.erro(response.message || 'Não foi possível excluir a imagem.');
          continue;
        }

        URL.revokeObjectURL(this.previewUrls[index]);
        this.selectedFiles.splice(index, 1);
        this.previewUrls.splice(index, 1);
        this.imageIds.splice(index, 1);
        this.imagemStates.excluir(imageId);
      } catch {
        this.alert.erro('Não foi possível excluir a imagem.');
      }
    }

    this.selectedIndexes.clear();
    this.previewIndex = null;
    this.syncActiveSection();
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
      const [imageId] = this.imageIds.splice(fromIndex, 1);
      this.selectedFiles.splice(index, 0, file);
      this.previewUrls.splice(index, 0, previewUrl);
      this.imageIds.splice(index, 0, imageId);
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

    if (files.length > 0) {
      this.marcarGaleriaComoRascunho();
    }

    let configuracoesAbertas = false;
    this.uploadingImages = files.length > 0;
    this.uploadedImages = 0;
    this.totalImages = files.length;
    this.uploadProgress = 0;
    this.currentImageProgress = 0;

    from(files)
      .pipe(
        concatMap((arquivo) =>
          this.imagemService.enviarImagem(galeriaId, galeriaSecaoId, arquivo).pipe(
            tap((event) => {
              if (event.type === HttpEventType.UploadProgress) {
                const total = event.total ?? arquivo.size;
                this.currentImageProgress = Math.round((event.loaded / total) * 100);
                this.uploadProgress = Math.round(
                  ((this.uploadedImages + this.currentImageProgress / 100) / this.totalImages) *
                    100,
                );
                this.changeDetector.markForCheck();
              }
            }),
            filter(
              (
                event,
              ): event is HttpResponse<{
                success: boolean;
                message: string;
                data: GaleriaImagemResponse;
              }> => event.type === HttpEventType.Response,
            ),
            map((event) => ({ arquivo, response: event.body! })),
            catchError((error) => {
              this.alert.erro(error?.error?.message ?? 'Não foi possível enviar a imagem.');
              return EMPTY;
            }),
            finalize(() => {
              this.uploadedImages++;
              this.currentImageProgress = 0;
              this.uploadProgress = Math.round((this.uploadedImages / this.totalImages) * 100);
              this.changeDetector.markForCheck();
            }),
          ),
        ),
        finalize(() => {
          this.uploadingImages = false;
        }),
      )
      .subscribe(({ arquivo, response }) => {
        if (!response.success) {
          this.alert.erro(response.message || 'Não foi possível enviar a imagem.');
          return;
        }

         this.adicionarImagemAprovada(
           arquivo,
           response.data.id,
           response.data.imagemPrincipal === true,
         );
        this.imagemStates.atualizar(response.data);
        this.changeDetector.markForCheck();

        if (abrirConfiguracoes && !configuracoesAbertas) {
          configuracoesAbertas = true;
          this.settingsOpen = true;
        }
      });
  }

  private adicionarImagemAprovada(arquivo: File, imageId: number, isPrimary = false): void {
    this.selectedFiles = [...this.selectedFiles, arquivo];
    this.previewUrls = [...this.previewUrls, URL.createObjectURL(arquivo)];
    this.imageIds = [...this.imageIds, imageId];
    if (isPrimary) this.primaryImageId = imageId;
    this.selectedIndexes.clear();

    if (this.sections.length === 0) {
      this.sections = [
        {
          id: 1,
          name: 'Untitled Section',
          files: [],
          previewUrls: [],
          imageIds: [],
          primaryImageId: null,
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
    form.id = this.galeriaState.obter()[0].id;

    this.galeriaService.galeriaEditar(form).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (dados) => {
          if (response.success) {
            this.galeriaState.atualizar(response.data);
            this.alert.sucesso('Galeria atualizada com sucesso');
          }
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  openClientModal(): void {
    this.loadClient();
    this.clientModalOpen = true;
  }

  closeClientModal(): void {
    this.clientModalOpen = false;
  }

  saveClient(): void {
    if (this.formCliente.invalid) {
      this.formCliente.markAllAsTouched();
      return;
    }

    const currentClient = this.clienteState.obter();
    if (currentClient) {
      this.clienteState.atualizar(currentClient);
      this.persistSessionData();
    }

    this.clientModalOpen = false;
  }

  private loadClient(): void {
    if (!this.formCliente) return;

    const currentClient = this.clienteState.obter();
    this.formCliente.controls.email.setValue(currentClient?.email ?? '');
    this.formCliente.controls.nome.setValue(currentClient?.nome ?? '');
    this.formCliente.controls.telefone.setValue(currentClient?.telefone ?? '');
  }

  private loadInitialSection(): void {
    const sections = this.galeriaSecaoState.obter();
    if (sections.length === 0 || this.sections.length > 0) return;

    this.sections = sections.map((section) => ({
      id: section.id,
      name: section.nome,
      files: [],
      previewUrls: [],
      imageIds: [],
      primaryImageId: null,
    }));
  }

  private carregarImagensSalvas(): void {
    const galeriaId = this.galeriaState.obter()[0]?.id;
    const galeriaSecaoId = this.galeriaSecaoState.obter()[0]?.id;
    if (!galeriaId || !galeriaSecaoId) return;

    this.imagemService.listarPorSecao(galeriaId, galeriaSecaoId).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (secoes) => {
          this.imagemStates.criar(secoes.flatMap((secao) => secao.imagens ?? []));

          for (const secao of secoes) {
            const sectionIndex = this.sections.findIndex((section) => section.id === secao.id);
            if (sectionIndex === -1) continue;

            const imagens = secao.imagens ?? [];
            this.sections[sectionIndex] = {
              ...this.sections[sectionIndex],
              name: secao.nome,
              previewUrls: imagens.map((imagem) => imagem.url),
              files: imagens.map(
                (imagem) => new File([], imagem.nomeArquivo, { type: 'image/webp' }),
              ),
              imageIds: imagens.map((imagem) => imagem.id),
              primaryImageId: imagens.find((imagem) => imagem.imagemPrincipal === true)?.id ?? null,
            };
          }

          this.loadActiveSection();
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  private carregarGaleriaSelecionada(galeriaId: number): void {
    this.galeriaService.obterGaleria(galeriaId).subscribe({
      next: (response) => {
        this.responseHandler.handle(response, (galeria) => {
          this.galeriaState.criar([galeria]);
          if (galeria.cliente) this.clienteState.criar(galeria.cliente);
          this.galeriaSecaoState.criar(galeria.secoes ?? []);
          this.sections = [];
          this.inicializarDadosGaleria();
        });
      },
      error: (error) => this.responseHandler.handleErro(error),
    });
  }

  private inicializarDadosGaleria(): void {
    this.loadInitialSection();
    this.carregarImagensSalvas();
  }

  private restoreSessionData(): void {
    const dados = this.sessionStorage.obterClienteGaleria();
    if (!dados) return;

    if (!this.clienteState.obter()) {
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
    const cliente = this.clienteState.obter();
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
    this.sections[this.activeSection].imageIds = [...this.imageIds];
    this.sections[this.activeSection].primaryImageId = this.primaryImageId;
  }

  private loadActiveSection(): void {
    const section = this.sections[this.activeSection];
    this.selectedFiles = section ? [...section.files] : [];
    this.previewUrls = section ? [...section.previewUrls] : [];
    this.imageIds = section ? [...section.imageIds] : [];
    this.primaryImageId = section?.primaryImageId ?? null;
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
