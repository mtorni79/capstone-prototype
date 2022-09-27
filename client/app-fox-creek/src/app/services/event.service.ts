import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventUrl = 'http://localhost:8082/api/organizations';
  errorMessage!: string;
  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event> {
    const results: Observable<Event> = this.http.get<Event>(this.eventUrl);
    console.log(`getEvents() returned ${results}`);
    return results;
  }
}
