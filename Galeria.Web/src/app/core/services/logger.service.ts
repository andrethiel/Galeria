import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

/**
 * Serviço de logging configurável por ambiente.
 * Em produção, não exibe logs no console (pode ser integrado a serviços de monitoramento).
 * Em desenvolvimento, usa console normal.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /**
   * Log de informação. Em produção, é silenciado.
   */
  info(message: string, ...args: unknown[]): void {
    if (!environment.production) {
      console.info(message, ...args);
    }
  }

  /**
   * Log de debug. Em produção, é silenciado.
   */
  debug(message: string, ...args: unknown[]): void {
    if (!environment.production) {
      console.debug(message, ...args);
    }
  }

  /**
   * Log de aviso. Sempre registrado, mesmo em produção.
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }

  /**
   * Log de erro. Sempre registrado, mesmo em produção.
   * Em um ambiente real, poderia enviar para um serviço de monitoramento (Sentry, etc).
   */
  error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }
}
