import { Injectable } from '@angular/core';
import { CollectionState } from './EntityState';
import { GaleriaResponse } from '../models/response/GaleriaResponse';

@Injectable({ providedIn: 'root' })
export class GaleriaState extends CollectionState<GaleriaResponse> {}
