import { Injectable } from '@angular/core';
import { CollectionState } from './EntityState';
import { GaleriaImagemResponse } from '../models/response/GaleriaImagemResponse';

@Injectable({ providedIn: 'root' })
export class GaleriaImagemState extends CollectionState<GaleriaImagemResponse> {
  definirPrincipal(idImagem: number): void {
    this.items.update((lista) =>
      lista.map((imagem) => ({
        ...imagem,
        imagemPrincipal: imagem.id === idImagem,
      })),
    );
  }
}
