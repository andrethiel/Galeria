import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { IconsComponent } from '../icons/icons';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, IconsComponent],
  templateUrl: './loader.html',
})
export class Loader {
  loading$;

  constructor(private loader: LoaderService) {
    this.loading$ = this.loader.loading$;
  }
}
