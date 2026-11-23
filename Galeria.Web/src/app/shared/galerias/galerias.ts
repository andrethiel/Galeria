import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GaleriaResponse } from '../../core/models/GaleriaResponse';
import { IconsComponent } from '../icons/icons';
import { ModalComponent } from '../modal/modal';
import { GaleriaState } from '../../core/state/galeria.state';
import { GaleriaSecaoState } from '../../core/state/galeriaSecao.state';

@Component({
  selector: 'app-galerias',
  imports: [RouterLink, IconsComponent, ModalComponent],
  templateUrl: './galerias.html',
})
export class Galerias {
  @Input() galerias!: GaleriaResponse;
  private readonly router = inject(Router);
  private readonly galeriaState = inject(GaleriaState);
  private readonly galeriaSecaoState = inject(GaleriaSecaoState);
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

  abrirEdicao(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.galeriaState.criar([this.galerias]);
    this.galeriaSecaoState.criar(this.galerias.secoes ?? []);
    void this.router.navigate(['/new'], {
      queryParams: { galeriaId: this.galerias.id },
    });
  }
}
