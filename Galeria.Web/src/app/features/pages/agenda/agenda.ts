import { Component } from '@angular/core';
import { CalendarioComponent } from '../../../shared/calendario/calendario';
import { EventoResponse } from '../../../core/models/response/EventoResponse';
import { AgendaEvent } from '../../../core/models/response/AgendaEvent';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda',
  imports: [CalendarioComponent, CommonModule],
  templateUrl: './agenda.html',
})
export class AgendaComponent {
  selectedDayDate: Date | null = null;
  selectedDayEvents: AgendaEvent[] = [];
  isDayEventsModalOpen = false;
  eventosCalendario: AgendaEvent[] = [
    {
      id: '1',
      title: 'Evento 1',
      start: new Date(),
      color: { primary: '#000000', secondary: '#000000' },
      meta: {
        descricao: 'Descrição do Evento 1',
        tipo: 'Tipo 1',
        unidade: 'Capela 1',
      },
    },
  ];

  onDaySelected(selection: { date: Date; events: AgendaEvent[] }): void {
    if (selection.events.length === 0) return;
    this.selectedDayDate = selection.date;
    this.selectedDayEvents = selection.events;
    this.isDayEventsModalOpen = true;
  }

  fecharModalEventos(): void {
    this.isDayEventsModalOpen = false;
    this.selectedDayDate = null;
    this.selectedDayEvents = [];
  }
}
