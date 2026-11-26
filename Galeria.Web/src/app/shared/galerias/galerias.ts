import { GaleriaService } from './../../core/services/galeria.service';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconsComponent } from '../icons/icons';
import { GaleriaState } from '../../core/state/galeria.state';
import { GaleriaSecaoState } from '../../core/state/galeriaSecao.state';
import { AlertService } from '../../core/services/alert.service';
import { ResponseHandlerService } from '../../core/services/response-handler.service';
import { GaleriaResponse } from '../../core/models/response/GaleriaResponse';

@Component({
  selector: 'app-galerias',
  imports: [IconsComponent],
  templateUrl: './galerias.html',
})
export class Galerias {
  @Input() galerias!: GaleriaResponse;
  @Output() excluida = new EventEmitter<number>();
  private readonly router = inject(Router);
  private readonly galeriaState = inject(GaleriaState);
  private readonly galeriaSecaoState = inject(GaleriaSecaoState);
  private readonly alert = inject(AlertService);
  private readonly galeriaService = inject(GaleriaService);
  private readonly responseHandler = inject(ResponseHandlerService);

  abrirEdicao(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.galeriaState.criar([this.galerias]);
    this.galeriaSecaoState.criar(this.galerias.secoes ?? []);
    void this.router.navigate(['/new'], {
      queryParams: { galeriaId: this.galerias.id },
    });
  }

  deleteGaleria() {
    this.alert
      .confirmacao(
        'Excluir galeira?',
        'Todas as informações dessa galeria e cliente seram excluidos',
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        this.galeriaService.delterarGaleria(this.galerias.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.excluida.emit(this.galerias.id);
              this.alert.sucesso('Galeria excluida com sucesso');
            }
          },
          error: (error) => this.responseHandler.erro(error),
        });
      });
  }
}
