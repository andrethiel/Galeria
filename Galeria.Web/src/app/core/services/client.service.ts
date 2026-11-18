import { Injectable } from '@angular/core';
import { ClienteCreateRequest } from '../models/create/ClienteCreateRequest';
import { environment } from '../../environments/environments';
import { HttpService } from './http.service';
import { ClienteResponse } from '../models/response/ClienteResponse';
import { ClienteGaleriaResponse } from '../models/response/ClienteGaleriaResponse';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private api = environment.apiUrl;
  constructor(private http: HttpService) {}

  inserirCliente(cliente: ClienteCreateRequest) {
    return this.http.post<ClienteResponse>(`${this.api}/CadastrarCliente`, cliente);
  }

  inserirClienteComGaleria(cliente: ClienteCreateRequest) {
    return this.http.post<ClienteGaleriaResponse>(`${this.api}/CadastrarClienteComGaleria`, {
      ...cliente,
      slug: null,
    });
  }
}
