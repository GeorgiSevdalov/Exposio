import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { ExpositionService } from './core/services/exposition.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  
  protected readonly title = signal('Exposio');
  expositions: any[] = [];

  constructor(
    private expoService: ExpositionService,
  ) {}

  ngOnInit() {
    this.expoService.getAll().subscribe({
      next: (data:any) => {
        this.expositions = data
        console.log('Expositions loaded successfully', this.expositions);},
      error: (err:any) => console.log('Error loading expositions', 'Close')
    });
  }
}
