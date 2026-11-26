import { Injectable } from '@angular/core';
import { EntityState } from './EntityState';
import { ClienteResponse } from '../models/response/ClienteResponse';

@Injectable({ providedIn: 'root' })
export class ClienteState extends EntityState<ClienteResponse> {}
