import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { icons, provideLucideIcons } from '@lucide/angular';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideLucideIcons(...Object.values(icons)),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
