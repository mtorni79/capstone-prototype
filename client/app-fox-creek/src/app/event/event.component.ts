import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fc-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  logo: string = './assets/images/logo.jpg';
  logoAlt: string = 'Fox Creek Logo';

  events!: any;
  errorMessage!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService) {}

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

  goToGroups(eventId: string): void{
      this.router.navigate(["groups"], {
        relativeTo: this.route,
        queryParams: { event: `${eventId}` },
      });
  }
}
