import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { GaleriaImagemResponse } from '../models/response/GaleriaImagemResponse';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ImagemService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpService) {}

  enviar(galeriaId: number, galeriaSecaoId: number, arquivo: File) {
    const formData = new FormData();
    formData.append('galeriaId', String(galeriaId));
    formData.append('galeriaSecaoId', String(galeriaSecaoId));
    formData.append('arquivo', arquivo, arquivo.name);

    return this.http.post<GaleriaImagemResponse>(`${this.api}/GaleriaImagem/Upload`, formData);
  }

  listarPorSecao(galeriaId: number, galeriaSecaoId: number) {
    return this.http.get<GaleriaImagemResponse[]>(
      `${this.api}/GaleriaImagem/Galeria/${galeriaId}/Secao/${galeriaSecaoId}`,
    );
  }
}
