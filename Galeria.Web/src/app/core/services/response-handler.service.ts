import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { LoggerService } from './logger.service';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlerService {
  constructor(
    private alert: AlertService,
    private logger: LoggerService,
  ) {}

  handle<T>(
    response: ApiResponse<T>,
    onSuccess: (data: T) => void,
    onFail?: (response: ApiResponse<T>) => void,
  ): boolean {
    if (response.success) {
      onSuccess(response.data);
      return true;
    }

    if (onFail) {
      onFail(response);
    } else {
      this.alert.erro(response.message);
    }
    return false;
  }

  handleErro(error: any): void {
    if (error?.sessionHandled) {
      return;
    }

    this.logger.error('Erro na requisição:', error);

    this.alert.erro(error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado.');
  }

  erro(err: unknown): void {
    this.alert.erro('Ocorreu um erro ao processar a solicitação.');
    this.logger.error('Erro processado:', err);
  }
}
