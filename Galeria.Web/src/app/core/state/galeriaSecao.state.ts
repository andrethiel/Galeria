import { Injectable } from '@angular/core';
import { CollectionState } from './EntityState';
import { GaleriaSecaoResponse } from '../models/response/GaleriaSecaoResponse';

@Injectable({ providedIn: 'root' })
export class GaleriaSecaoState extends CollectionState<GaleriaSecaoResponse> {}
