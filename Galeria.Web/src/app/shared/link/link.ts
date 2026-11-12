import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonColor = 'primary' | 'secondary';

@Component({
  selector: 'app-link',
  imports: [RouterLink, NgClass],
  templateUrl: './link.html',
})
export class Link {
  @Input() Href!: string;
  @Input() Color: ButtonColor = 'primary';

  get classes(): string {
    const base = 'w-full text-sm font-medium py-2 p-4 rounded-lg transition-colors duration-200';
    const colorClass =
      this.Color === 'primary'
        ? 'bg-primary text-[var(--text-primary)] hover:bg-[var(--hover-primary)]'
        : 'bg-secondary text-[var(--text-secondary)] hover:bg-[var(--hover-secondary)]';
    return `${base} ${colorClass}`;
  }
}
