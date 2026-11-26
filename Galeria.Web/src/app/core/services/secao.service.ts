import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { GaleriaSecaoResponse } from '../models/response/GaleriaSecaoResponse';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class SecaoService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpService) {}

  cadastrar(galeriaId: number, nome: string) {
    return this.http.post<GaleriaSecaoResponse>(`${this.api}/SecaoCadastrar`, { galeriaId, nome });
  }

  editar(id: number, nome: string) {
    return this.http.put<GaleriaSecaoResponse>(`${this.api}/SecaoEditar`, { id, nome });
  }

  excluir(id: number) {
    return this.http.delete<GaleriaSecaoResponse>(`${this.api}/SecaoExcluir/${id}`);
  }
}
