import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '../icons/icons';

@Component({
  selector: 'app-textarea',
  imports: [IconsComponent, ReactiveFormsModule],
  templateUrl: './textarea.html',
})
export class TextAreaComponent {
  @Input() control!: FormControl;
  @Input() Icon!: string;
  @Input() Id!: string;
  @Input() Rows: number = 3;
  @Input() Placeholder: string = '';
  @Input() Name!: string;
}
