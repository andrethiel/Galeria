import { Injectable } from '@angular/core';
import { CollectionState } from './EntityState';
import { ClienteResponse } from '../models/response/ClienteResponse';

@Injectable({ providedIn: 'root' })
export class ClienteState extends CollectionState<ClienteResponse> {}
