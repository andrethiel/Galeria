import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarDatePipe,
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarView,
  CalendarWeekViewComponent,
  DateAdapter,
  DateFormatterParams,
  provideCalendar,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { IconsComponent } from '../icons/icons';
import { AgendaEvent } from '../../core/models/response/AgendaEvent';
import { CommonModule } from '@angular/common';

@Injectable()
class PortugueseCalendarDateFormatter extends CalendarDateFormatter {
  override weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }

  override dayViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }
}

@Component({
  selector: 'app-calendario',
  imports: [
    CalendarPreviousViewDirective,
    CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    CalendarDatePipe,
    IconsComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .event-calendar {
        --calendar-accent: #b7a797;
        --calendar-text: #253044;
        --calendar-muted: #a5a9b2;

        max-width: 28rem;
        margin: 0 auto;
        color: var(--calendar-text);
      }

      /* Cabeçalho */

      .event-calendar__header {
        padding: 1.25rem 1rem 0;
        text-align: center;
      }

      .event-calendar__title {
        margin: 0;
        color: #253044;
        font-size: 1.25rem;
        font-weight: 700;
      }

      /* Toolbar */

      .event-calendar__toolbar {
        display: grid;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .event-calendar__month-navigation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-height: 3.5rem;
        padding: 0.45rem 0.5rem;
        border-radius: 999px;
        background: var(--calendar-accent);
        color: #fff;
      }

      .event-calendar__month-navigation h3 {
        flex: 1;
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        text-transform: capitalize;
      }

      .event-calendar__arrow {
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        flex: 0 0 auto;
        place-items: center;
        border: 0;
        border-radius: 999px;
        background: #fff;
        color: var(--calendar-accent);
        cursor: pointer;
        transition:
          transform 150ms ease,
          background-color 150ms ease;
      }

      .event-calendar__arrow:hover {
        background: #f8f5f2;
        transform: scale(1.04);
      }

      /* Opções de visualização */

      .event-calendar__view-options {
        display: flex;
        justify-content: center;
        gap: 0.25rem;
      }

      .event-calendar__view-options button {
        border: 0;
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        color: var(--calendar-muted);
        font-size: 0.75rem;
        cursor: pointer;
      }

      .event-calendar__view-options button.is-active,
      .event-calendar__view-options button:hover {
        background: #f1ece7;
        color: #806f60;
      }

      /* Corpo */

      .event-calendar__body {
        margin: 1rem;
        padding: 0.75rem;
        overflow: hidden;
        border-radius: 1rem;
        background: #fff;
      }

      /* Calendário mensal */

      .event-calendar .cal-month-view {
        background: transparent;
      }

      /* Cabeçalho dos dias */

      .event-calendar .cal-month-view .cal-header {
        color: var(--calendar-muted);
        font-size: 0.7rem;
        font-weight: 400;
        text-transform: capitalize;
      }

      .event-calendar .cal-month-view .cal-header .cal-cell {
        padding: 0.55rem 0;
        font-size: 0;
        font-weight: 400;
      }

      /* Abreviação dos dias da semana */

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(1)::after {
        content: 'Dom.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(2)::after {
        content: 'Seg.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(3)::after {
        content: 'Ter.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(4)::after {
        content: 'Qua.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(5)::after {
        content: 'Qui.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(6)::after {
        content: 'Sex.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell:nth-child(7)::after {
        content: 'Sáb.';
      }

      .event-calendar .cal-month-view .cal-header .cal-cell::after {
        font-size: 0.7rem;
        font-weight: 400;
      }

      /* Remover bordas padrão */

      .event-calendar .cal-month-view .cal-days {
        border: 0;
      }

      .event-calendar .cal-month-view .cal-cell-row {
        border: 0;
      }

      .event-calendar .cal-month-view .cal-day-cell {
        min-height: 3rem;
        border: 0;
      }

      /* Remover fundos de hover */

      .event-calendar .cal-month-view .cal-cell-row:hover,
      .event-calendar .cal-month-view .cal-cell-row .cal-cell:hover,
      .event-calendar .cal-month-view .cal-day-cell:hover,
      .event-calendar .cal-month-view .cal-cell.cal-has-events.cal-open {
        background: transparent !important;
      }

      /* Célula do dia */

      .event-calendar .cal-month-view .cal-cell-top {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* Número dos dias */

      .event-calendar .cal-month-view .cal-day-number {
        position: absolute !important;
        top: 0.45rem !important;
        left: 50% !important;
        z-index: 2;

        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: 2.5rem !important;
        height: 2.5rem !important;

        padding: 0 !important;
        margin: 0 !important;

        box-sizing: border-box !important;
        border-radius: 50%;

        color: var(--calendar-text) !important;
        font-family: inherit !important;
        font-size: 0.8rem !important;
        font-weight: 400 !important;
        line-height: 1 !important;
        text-align: center !important;

        opacity: 1 !important;
        transform: translateX(-50%) !important;
      }

      /* Finais de semana */

      .event-calendar .cal-month-view .cal-day-cell.cal-weekend .cal-day-number {
        color: var(--calendar-text) !important;
      }

      /* Dias de outros meses */

      .event-calendar .cal-month-view .cal-day-cell.cal-out-month .cal-day-number {
        color: #d5dbe3 !important;
        opacity: 1 !important;
      }

      /* Dia atual */

      .event-calendar .cal-month-view .cal-day-cell.cal-today {
        background: transparent !important;
      }

      .event-calendar .cal-month-view .cal-day-cell.cal-today .cal-day-number {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: 2.5rem !important;
        height: 2.5rem !important;

        padding: 0 !important;
        margin: 0 !important;

        border-radius: 50% !important;
        background: var(--calendar-accent) !important;
        color: #fff !important;

        font-family: inherit !important;
        font-size: 0.8rem !important;
        font-weight: 600 !important;
        line-height: 1 !important;
      }

      /* Indicadores de eventos */

      .event-calendar .cal-month-view .cal-event {
        width: 0.35rem;
        height: 0.35rem;
        margin: 0.1rem auto;
        background: var(--calendar-accent);
        border-color: var(--calendar-accent);
      }

      .event-calendar .cal-month-view .cal-events {
        position: absolute;
        right: 0;
        bottom: 0.35rem;
        left: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        margin: 0;
      }

      /* Contador de eventos */

      .event-calendar .cal-month-view .cal-day-badge {
        position: absolute !important;
        top: 0.25rem !important;
        left: calc(50% + 1.1rem) !important;
        z-index: 3 !important;

        margin: 0 !important;
        padding: 0.15rem 0.4rem;

        background: #c84d4d !important;
        font-size: 0.65rem !important;
      }

      /* Estado vazio */

      .event-calendar__empty {
        margin: 10rem 0 2rem;
        color: #686868;
        text-align: center;
        font-size: 0.9rem;
      }

      /* Tablet */

      @media (min-width: 640px) {
        .event-calendar__header {
          padding-inline: 0;
        }

        .event-calendar__body {
          margin-inline: 0;
          padding: 1rem;
        }
      }

      /* Desktop */

      @media (min-width: 1024px) {
        .event-calendar {
          max-width: 72rem;
        }

        .event-calendar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 0.5rem 0 1.25rem;
          text-align: left;
        }

        .event-calendar__title {
          font-size: 1.5rem;
        }

        .event-calendar__toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0;
        }

        .event-calendar__month-navigation {
          width: 22rem;
        }

        .event-calendar__body {
          margin: 0;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 1.5rem;
          box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
        }

        .event-calendar .cal-month-view .cal-header .cal-cell {
          padding: 0.75rem 0;
        }

        .event-calendar .cal-month-view .cal-day-cell {
          min-height: 6.5rem;
        }

        .event-calendar .cal-month-view .cal-day-number {
          top: 0.75rem !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
        }

        .event-calendar .cal-month-view .cal-day-cell.cal-today .cal-day-number {
          width: 2.5rem !important;
          height: 2.5rem !important;
        }

        .event-calendar__empty {
          margin: 4rem 0 2rem;
        }
      }
    `,
  ],
  templateUrl: './calendario.html',
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
    { provide: CalendarDateFormatter, useClass: PortugueseCalendarDateFormatter },
    CommonModule,
  ],
})
export class CalendarioComponent {
  @Input() events: AgendaEvent[] = [];
  @Input() dia = false;
  @Input() mes = false;
  @Input() semana = false;

  @Output() daySelected = new EventEmitter<{ date: Date; events: AgendaEvent[] }>();
  @Output() eventSelected = new EventEmitter<AgendaEvent>();
  @Output() eventMoved = new EventEmitter<CalendarEventTimesChangedEvent>();

  view: CalendarView = CalendarView.Month;
  readonly locale = 'pt-BR';
  CalendarView = CalendarView;
  viewDate = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen = false;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (!isSameMonth(date, this.viewDate)) return;
    this.activeDayIsOpen = false;
    this.viewDate = date;
    this.daySelected.emit({ date, events: events as AgendaEvent[] });
  }

  eventClicked(event: CalendarEvent): void {
    this.eventSelected.emit(event as AgendaEvent);
  }

  eventTimesChanged(event: CalendarEventTimesChangedEvent): void {
    this.eventMoved.emit(event);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }
  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }
}
