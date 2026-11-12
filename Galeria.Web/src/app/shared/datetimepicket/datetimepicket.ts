import { Component, Input } from '@angular/core';
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
  @Input() control!: FormControl;
  @Input() Icon!: string;
  @Input() Id!: string;
  @Input() Placeholder: string = '';
  @Input() Name!: string;
  @Input() Tempo = false;
  @Input() DateFormat: string = 'Y-m-d H:i';
  @Input() AltFormat: string | null = null;

  readonly localePt = Portuguese;

  get altFormatComputed(): string {
    return this.AltFormat ?? (this.Tempo ? 'd/m/Y H:i' : this.DateFormat);
  }
}
