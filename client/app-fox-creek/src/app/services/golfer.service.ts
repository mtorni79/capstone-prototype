import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class GolferService {
  url = 'http://localhost:8082/api/groups';
  formContentTypeHeaders = {
    headers: new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    ),
  };

  constructor(private http: HttpClient) {}

  getGroupById(groupId: number): Observable<Group> {
    const results: Observable<Group> = this.http.get<Group>(
      `${this.url}/${groupId}`
    );
    console.log(`getGroupById() returned ${results}`);
    return results;
  }
}
