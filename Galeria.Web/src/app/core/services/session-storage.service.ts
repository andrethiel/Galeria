import { Injectable } from '@angular/core';
import { ClienteGaleriaResponse } from '../models/response/ClienteGaleriaResponse';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  private readonly clienteGaleriaKey = 'galeria.cliente-galeria';

  salvarClienteGaleria(dados: ClienteGaleriaResponse): void {
    sessionStorage.setItem(this.clienteGaleriaKey, JSON.stringify(dados));
  }

  obterClienteGaleria(): ClienteGaleriaResponse | null {
    const dados = sessionStorage.getItem(this.clienteGaleriaKey);
    if (!dados) return null;

    try {
      return JSON.parse(dados) as ClienteGaleriaResponse;
    } catch {
      sessionStorage.removeItem(this.clienteGaleriaKey);
      return null;
    }
  }

  limparClienteGaleria(): void {
    sessionStorage.removeItem(this.clienteGaleriaKey);
  }
}
