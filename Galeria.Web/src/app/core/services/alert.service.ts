import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  sucesso(titulo: string, texto?: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
    });
  }

  erro(titulo: string, texto?: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
    });
  }

  alerta(titulo: string, texto?: string | string[]) {
    const html = Array.isArray(texto)
      ? `
        <ul style="text-align:left; margin:0; padding-left:20px;">
          ${texto.map((x) => `<li>${x}</li>`).join('')}
        </ul>
      `
      : (texto ?? '');

    Swal.fire({
      icon: 'warning',
      title: titulo,
      html,
    });
  }

  confirmacao(titulo: string, texto?: string) {
    return Swal.fire({
      icon: 'question',
      title: titulo,
      text: texto,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-primary text-[var(--text-primary)] hover:bg-[var(--hover-primary)] px-4 py-2 rounded-lg mr-2',
        cancelButton: 'bg-secondary text-[var(--text-secondary)] hover:bg-[var(--hover-secondary)] px-4 py-2 rounded-lg',
      },
      buttonsStyling: false,
    });
  }
}
