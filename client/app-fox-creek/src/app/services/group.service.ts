import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  url = 'http://localhost:8082/api/groups/byorganization/event1';
  errorMessage!: string;
  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getGroupsByEventId(eventId:string): Observable<Group> {
    const results: Observable<Group> = this.http.get<Group>(this.url);
    console.log(`getGroupsByEventId() returned ${results}`);
    return results;
  }
}
