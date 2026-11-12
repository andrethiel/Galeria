import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '../icons/icons';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input',
  imports: [IconsComponent, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input.html',
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() Icon!: string;
  @Input() Id!: string;
  @Input() Type: string = 'text';
  @Input() Placeholder: string = '';
  @Input() Name!: string;
  @Input() Telefone!: boolean;
  @Input() Cep = false;
  @Output() blur = new EventEmitter<FocusEvent>();
}
