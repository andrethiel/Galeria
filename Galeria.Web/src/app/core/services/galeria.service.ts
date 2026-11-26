import { GaleriaRequest } from './../models/GaleriaRequest';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpService } from './http.service';
import { GaleriaCreateRequest } from '../models/create/GaleriaCreateRequest';
import { GaleriaEditRequest } from '../models/edit/GaleriaEditRequest';
import { PaginacaoResponse } from '../models/response/PaginacaoResponse';
import { GaleriaResponse } from '../models/response/GaleriaResponse';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private api = environment.apiUrl;
  constructor(private http: HttpService) {}

  cadastrarGaleria(cliente: GaleriaCreateRequest) {
    return this.http.post<GaleriaResponse>(`${this.api}/CadastrarGaleria`, cliente);
  }

  filtrarGaleria(galeria: GaleriaRequest) {
    return this.http.post<PaginacaoResponse<GaleriaResponse>>(
      `${this.api}/FiltrarGaleria`,
      galeria,
    );
  }

  galeriaEditar(cliente: GaleriaEditRequest) {
    return this.http.post<GaleriaResponse>(`${this.api}/EditarGaleria`, cliente);
  }

  publicarGaleria(idGaleria: number) {
    return this.http.get<GaleriaResponse>(`${this.api}/Galerias/Publicar?idGaleria=${idGaleria}`);
  }

  listarGalerias(page = 1, pageSize = 20) {
    return this.http.get<PaginacaoResponse<GaleriaResponse>>(
      `${this.api}/Galerias?page=${page}&pageSize=${pageSize}`,
    );
  }

  obterGaleria(id: number) {
    return this.http.get<GaleriaResponse>(`${this.api}/Galerias/${id}`);
  }

  delterarGaleria(id: number) {
    return this.http.delete(`${this.api}/Galerias/Excluir/${id}`);
  }
}
