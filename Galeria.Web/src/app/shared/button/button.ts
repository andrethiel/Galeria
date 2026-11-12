import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ButtonColor = 'primary' | 'secondary' | 'excluir';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
})
export class ButtonComponent {
  @Input() Type: string = 'button';
  @Input() Disabled: boolean = false;
  @Input() Color: ButtonColor = 'primary';
  @Input() FullWidth = true;

  get classes(): string {
    const base = `${this.FullWidth ? 'w-full' : 'w-auto'} inline-flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200`;
    const colorClass = this.colors;
    const disabledStyles = 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300';
    return `${base} ${this.Disabled ? disabledStyles : colorClass}`;
  }

  get colors(): string {
    if (this.Color === 'primary') {
      return 'bg-primary text-[var(--text-primary)] hover:bg-[var(--hover-primary)]';
    }
    if (this.Color === 'secondary') {
      return 'bg-secondary text-[var(--text-secondary)] hover:bg-[var(--hover-secondary)]';
    }

    return 'bg-red-500 text-white hover:bg-red-700';
  }
}
