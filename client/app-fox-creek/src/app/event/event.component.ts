import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'fc-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events!: any;
  errorMessage!: string;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        this.events = res;
        console.log(this.events);
      },
      error: (err) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err.message));
      },
      complete: () => {
        console.log(`called getEvents()`);
      },
    });
  }
}

