import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import { IconsComponent } from '../icons/icons';

@Component({
  selector: 'app-datetimepicker',
  imports: [FlatpickrDirective, IconsComponent, ReactiveFormsModule],
  templateUrl: './datetimepicket.html',
})
export class DateTimePickerComponent {
  @Output() dateChange = new EventEmitter<string | null>();
  @Input() control!: FormControl;
  @Input() Icon!: string;
  @Input() Id!: string;
  @Input() Placeholder: string = '';
  @Input() Name!: string;
  @Input() Tempo = false;
  @Input() DateFormat: string = 'Y-m-d H:i';
  @Input() AltFormat: string | null = null;
  @Input() MinDate: Date | null = null;

  readonly localePt = Portuguese;

  get minDateComputed(): Date | string {
    return this.MinDate ?? '';
  }

  onFlatpickrChange(event: { dateString: string }): void {
    this.dateChange.emit(event.dateString || null);
  }

  get altFormatComputed(): string {
    return this.AltFormat ?? (this.Tempo ? 'd/m/Y H:i' : this.DateFormat);
  }
}
