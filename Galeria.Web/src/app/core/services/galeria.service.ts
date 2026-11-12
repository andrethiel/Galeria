import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpService } from './http.service';
import { GaleriaCreateRequest } from '../models/create/GaleriaCreateRequest';
import { GaleriaResponse } from '../models/GaleriaResponse';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private api = environment.apiUrl;
  constructor(private http: HttpService) {}

  cadastrarGaleria(cliente: GaleriaCreateRequest) {
    return this.http.post<GaleriaResponse>(`${this.api}/CadastrarGaleria`, cliente);
  }
}
