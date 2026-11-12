import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { ClienteCreateRequest } from '../../../core/models/create/ClienteCreateRequest';
import { ClienteState } from '../../../core/state/cliente.state';
import { IconsComponent } from '../../../shared/icons/icons';
import { ModalComponent } from '../../../shared/modal/modal';

type GallerySection = {
  id: number;
  name: string;
  files: File[];
  previewUrls: string[];
};

@Component({
  selector: 'app-new-galeria',
  imports: [FormsModule, IconsComponent, ModalComponent],
  templateUrl: './new-galeria.html',
})
export class NewGaleria {
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
  galleryName = '';
  sessionDate = '';
  galleryUrl = '';
  password = '';
  clientModalOpen = false;
  cliente: ClienteCreateRequest = {
    nome: null,
    email: null,
    telefone: null,
  };

  constructor(
    route: ActivatedRoute,
    private readonly alert: AlertService,
    private readonly clienteState: ClienteState,
  ) {
    this.loadClient();

    route.queryParamMap.subscribe((params) => {
      this.settingsOpen = params.has('settings');
    });
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
    this.selectedFiles = [...this.selectedFiles, ...files];
    this.previewUrls = this.selectedFiles.map((file) => URL.createObjectURL(file));
    this.selectedIndexes.clear();
    this.syncActiveSection();
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
    if (this.sections.length === 0) {
      this.sections = [
        {
          id: 1,
          name: 'Untitled Section',
          files: [...this.selectedFiles],
          previewUrls: [...this.previewUrls],
        },
      ];
    }

    if (this.sections.length === 1) {
      this.addSection();
    }

    this.activeSection = 0;
    this.loadActiveSection();
  }

  addSection(): void {
    this.syncActiveSection();
    const id = this.sections.length + 1;
    this.sections = [
      ...this.sections,
      { id, name: 'Untitled Section', files: [], previewUrls: [] },
    ];
    this.activeSection = this.sections.length - 1;
    this.loadActiveSection();
  }

  removeSection(index: number): void {
    this.alert
      .confirmacao(
      'Excluir seção?',
      'As imagens desta seção serão removidas da organização atual.',
      )
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
    this.selectedFiles = files.filter((file) => file.type === 'image/jpeg');
    this.previewUrls = this.selectedFiles.map((file) => URL.createObjectURL(file));
    this.selectedIndexes.clear();

    if (this.sections.length === 0 && this.selectedFiles.length > 0) {
      this.sections = [
        {
          id: 1,
          name: 'Untitled Section',
          files: [...this.selectedFiles],
          previewUrls: [...this.previewUrls],
        },
      ];
      this.activeSection = 0;
    }

    this.syncActiveSection();
    if (wasEmpty && this.selectedFiles.length > 0) {
      this.settingsOpen = true;
    }
  }

  closeSettings(): void {
    this.settingsOpen = false;
  }

  saveSettings(): void {
    if (this.galleryName.trim() && this.galleryUrl.trim()) {
      this.settingsOpen = false;
    }
  }

  openClientModal(): void {
    this.loadClient();
    this.clientModalOpen = true;
  }

  closeClientModal(): void {
    this.clientModalOpen = false;
  }

  saveClient(): void {
    if (!this.cliente.nome?.trim() || !this.cliente.email?.trim() || !this.cliente.telefone?.trim()) {
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
}
