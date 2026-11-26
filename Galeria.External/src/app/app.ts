import { Component, ElementRef, signal, ViewChild } from '@angular/core';

interface Photo {
  url: string;
  alt: string;
}

interface GallerySection {
  id: string;
  title: string;
  photos: Photo[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('galleryContent') private galleryContent?: ElementRef<HTMLElement>;

  protected readonly galleryTitle = 'Um dia para lembrar';
  protected readonly galleryDescription = 'Uma coleção de momentos especiais, organizada para contar a história completa.';
  protected readonly sections: GallerySection[] = [
    {
      id: 'preparativos',
      title: 'Preparativos',
      photos: this.photos('preparativos', [
        'photo-1519225421980-715cb0215aed', 'photo-1519741497674-611481863552',
        'photo-1511285560929-80b456fea0bc', 'photo-1507504031003-b417219a0fde'
      ])
    },
    {
      id: 'cerimonia',
      title: 'Cerimônia',
      photos: this.photos('cerimônia', [
        'photo-1511285560929-80b456fea0bc', 'photo-1544078751-58fee2d8a03b',
        'photo-1606800052052-a08af7148866', 'photo-1519741497674-611481863552'
      ])
    },
    {
      id: 'celebracao',
      title: 'Celebração',
      photos: this.photos('celebração', [
        'photo-1464366400600-7168b8af9bc3', 'photo-1519167758481-83f550bb49b3',
        'photo-1531058020387-3be344556be6', 'photo-1511795409834-ef04bbd61622'
      ])
    }
  ];

  protected readonly featuredImage = signal<Photo>(this.sections[0].photos[0]);
  protected readonly selectedPhoto = signal<Photo | null>(null);
  protected readonly totalPhotos = this.sections.reduce((total, section) => total + section.photos.length, 0);

  protected selectPhoto(photo: Photo): void {
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

  private photos(section: string, ids: string[]): Photo[] {
    return ids.map((id, index) => ({
      url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`,
      alt: `${section}, foto ${index + 1}`
    }));
  }
}
