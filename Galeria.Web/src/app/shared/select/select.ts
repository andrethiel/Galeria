import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '../icons/icons';
import { SelectOption } from '../../core/models/response/SelectOption';

@Component({
  selector: 'app-select',
  imports: [IconsComponent, ReactiveFormsModule],
  templateUrl: './select.html',
})
export class SelectComponent {
  @Input() control!: FormControl;
  @Input() Icon!: string;
  @Input() Id!: string;
  @Input() Placeholder: string = '';
  @Input() Name!: string;
  @Input() Options: SelectOption[] = [];
}
