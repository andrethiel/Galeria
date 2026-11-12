import { Injectable } from '@angular/core';
import { GaleriaResponse } from '../models/GaleriaResponse';
import { CollectionState } from './EntityState';

@Injectable({ providedIn: 'root' })
export class GaleriaState extends CollectionState<GaleriaResponse> {}
