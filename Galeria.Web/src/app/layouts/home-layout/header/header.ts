import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconsComponent } from '../../../shared/icons/icons';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, IconsComponent],
  templateUrl: './header.html',
})
export class Header {
  constructor(private readonly router: Router) {}

  openGallerySettings(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/new'], {
      queryParams: { settings: Date.now() },
    });
  }
}
