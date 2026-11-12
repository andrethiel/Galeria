import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GaleriaResponse } from '../../core/models/GaleriaResponse';
import { IconsComponent } from '../icons/icons';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-galerias',
  imports: [RouterLink, IconsComponent, ModalComponent],
  templateUrl: './galerias.html',
})
export class Galerias {
  @Input() galerias!: GaleriaResponse;
  menuOpen = false;
  modal: 'share' | 'activity' | null = null;
  activeActivityTab = 'Registrar E-mails';

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  openModal(type: 'share' | 'activity', event: Event): void {
    event.stopPropagation();
    this.menuOpen = false;
    this.modal = type;
  }

  closeModal(): void {
    this.modal = null;
  }

  selectActivityTab(tab: string): void {
    this.activeActivityTab = tab;
  }
}
