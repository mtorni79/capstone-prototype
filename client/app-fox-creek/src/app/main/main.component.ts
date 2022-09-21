import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'fc-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  routerLink!: string;
  router;

  constructor(private _router: Router) {
    this.router = _router;
  }

  ngOnInit(): void {}
}
