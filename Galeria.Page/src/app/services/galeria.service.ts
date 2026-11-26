import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpService } from './http.service';
import { GaleriaCliente } from '../models/GaleriaCliente';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private api = environment.apiUrl;
  constructor(private http: HttpService) {}

  obterGaleria(senha: string, token: string) {
    return this.http.get<GaleriaCliente>(
      `${this.api}/GaleriaCliente/${encodeURIComponent(senha)}/${encodeURIComponent(token)}`,
    );
  }
}
