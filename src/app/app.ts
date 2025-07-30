import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Exposio');
}
