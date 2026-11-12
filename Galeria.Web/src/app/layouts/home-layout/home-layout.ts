import { Component } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './home-layout.html',
})
export class HomeLayout {}
