import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { GaleriaService } from './services/galeria.service';
import { GaleriaCliente } from './models/GaleriaCliente';
import { GaleriaImagem } from './models/GaleriaImagem';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly galeriaService = inject(GaleriaService);
  @ViewChild('galleryContent') private galleryContent?: ElementRef<HTMLElement>;

  protected readonly galleryTitle = 'Um dia para lembrar';
  protected readonly galleryDescription =
    'Uma coleção de momentos especiais, organizada para contar a história completa.';
  protected sections: GaleriaCliente = { imagemPrincipal: '', secoes: [] };
  protected readonly featuredImage = signal<GaleriaImagem>({ url: '' });
  protected readonly selectedPhoto = signal<GaleriaImagem | null>(null);

  protected get totalPhotos(): number {
    return this.sections.secoes.reduce((total, section) => total + section.imagens.length, 0);
  }

  constructor() {
    const [senha, token] = window.location.pathname.split('/').filter(Boolean).slice(0, 2);

    // A página continua apresentando o mock quando aberta na raiz.
    if (senha && token) {
      this.loadGallery(senha, token);
    }
  }

  protected selectPhoto(photo: GaleriaImagem): void {
    this.featuredImage.set(photo);
    this.selectedPhoto.set(photo);
  }

  protected closePhoto(): void {
    this.selectedPhoto.set(null);
  }

  protected scrollToGallery(): void {
    this.galleryContent?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  protected scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private loadGallery(senha: string, token: string): void {
    this.galeriaService.obterGaleria(senha, token).subscribe({
      next: (response) => {
        if (response.success) {
          this.sections = response.data;
          const firstPhoto = this.sections.secoes.flatMap(section => section.imagens)[0];
          this.featuredImage.set(
            this.sections.imagemPrincipal
              ? { url: this.sections.imagemPrincipal }
              : firstPhoto ?? { url: '' },
          );
        }
      },
      error: (error) => console.error('Não foi possível carregar a galeria.', error),
    });
  }
}
