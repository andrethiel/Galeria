import { CalendarEvent } from 'angular-calendar';

export interface AgendaEvent extends CalendarEvent {
  id?: string;
  meta?: {
    descricao?: string;
    tipo?: string;
    unidade?: string;
  };
}
