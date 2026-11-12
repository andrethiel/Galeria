import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconsComponent } from '../icons/icons';

@Component({
  selector: 'app-modal',
  imports: [IconsComponent],
  templateUrl: './modal.html',
})
export class ModalComponent {
  @Input() Open = false;
  @Input() Size: 'share' | 'activity' | 'lightbox' | 'settings' = 'share';
  @Output() Closed = new EventEmitter<void>();

  get panelClasses(): string {
    if (this.Size === 'lightbox') {
      return 'max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] bg-transparent shadow-none';
    }

    if (this.Size === 'settings') {
      return 'h-[calc(100vh-3rem)] max-w-5xl';
    }

    return this.Size === 'activity'
      ? 'h-[calc(100vh-2.5rem)] max-w-6xl'
      : 'min-h-[19rem] max-w-3xl';
  }

  get backdropClasses(): string {
    return this.Size === 'lightbox' ? 'bg-black/60' : 'bg-black/35';
  }

  close(): void {
    this.Closed.emit();
  }
}
