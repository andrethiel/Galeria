import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpService } from './http.service';
import { GaleriaCreateRequest } from '../models/create/GaleriaCreateRequest';
import { GaleriaResponse } from '../models/GaleriaResponse';
import { GaleriaEditRequest } from '../models/edit/GaleriaEditRequest';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private api = environment.apiUrl;
  constructor(private http: HttpService) {}

  cadastrarGaleria(cliente: GaleriaCreateRequest) {
    return this.http.post<GaleriaResponse>(`${this.api}/CadastrarGaleria`, cliente);
  }

  galeriaEditar(cliente: GaleriaEditRequest) {
    return this.http.post<GaleriaResponse>(`${this.api}/EditarGaleria`, cliente);
  }

  publicarGaleria(idGaleria: number) {
    return this.http.get<GaleriaResponse>(`${this.api}/Galerias/Publicar?idGaleria=${idGaleria}`);
  }

  listarGalerias() {
    return this.http.get<GaleriaResponse[]>(`${this.api}/Galerias`);
  }

  obterGaleria(id: number) {
    return this.http.get<GaleriaResponse>(`${this.api}/Galerias/${id}`);
  }
}
