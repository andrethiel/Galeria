import { Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-icons',
  imports: [LucideDynamicIcon],
  templateUrl: './icons.html',
  host: {
    class: 'inline-flex shrink-0 align-middle',
  },
})
export class IconsComponent {
  /** Nome do ícone. Aceita camera, Camera, camera_off ou camera-off. */
  readonly name = input('circle-help');

  readonly iconName = computed(() => this.name());
}
