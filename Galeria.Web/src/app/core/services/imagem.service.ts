import { HttpClient, HttpContext, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { GaleriaImagemResponse } from '../models/response/GaleriaImagemResponse';
import { GaleriaSecaoResponse } from '../models/response/GaleriaSecaoResponse';
import { HttpService } from './http.service';
import { ApiResponse } from '../models/ApiResponse';
import { SKIP_LOADING } from '../interceptors/loading-interceptor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImagemService {
  private readonly api = environment.apiUrl;

  constructor(
    private readonly http: HttpService,
    private readonly HttpClient: HttpClient,
  ) {}

  enviar(galeriaId: number, galeriaSecaoId: number, arquivo: File) {
    const formData = new FormData();
    formData.append('galeriaId', String(galeriaId));
    formData.append('galeriaSecaoId', String(galeriaSecaoId));
    formData.append('arquivo', arquivo, arquivo.name);

    return this.http.post<GaleriaImagemResponse>(`${this.api}/GaleriaImagem/Upload`, formData);
  }

  listarPorSecao(galeriaId: number, galeriaSecaoId: number) {
    return this.http.get<GaleriaSecaoResponse[]>(
      `${this.api}/GaleriaImagem/Galeria/${galeriaId}/Secao/${galeriaSecaoId}`,
    );
  }

  excluir(galeriaId: number, id: number) {
    return this.http.delete<GaleriaImagemResponse>(
      `${this.api}/GaleriaImagem/Galeria/${galeriaId}/${id}`,
    );
  }

  imagemPrincipal(idImagem: number) {
    return this.http.get<GaleriaImagemResponse>(
      `${this.api}/GaleriaImagem/Principal?idImagem=${idImagem}`,
    );
  }

  enviarImagem(
    galeriaId: number,
    galeriaSecaoId: number,
    arquivo: File,
  ): Observable<HttpEvent<ApiResponse<GaleriaImagemResponse>>> {
    const formData = new FormData();
    formData.append('galeriaId', String(galeriaId));
    formData.append('galeriaSecaoId', String(galeriaSecaoId));
    formData.append('arquivo', arquivo, arquivo.name);

    return this.HttpClient.post<ApiResponse<GaleriaImagemResponse>>(
      `${this.api}/GaleriaImagem/Upload`,
      formData,
      {
        context: new HttpContext().set(SKIP_LOADING, true),
        reportProgress: true,
        observe: 'events',
      },
    );
  }
}
