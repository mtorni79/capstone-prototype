import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class GolferService {
  golferUrl = 'http://localhost:8082/api/groups';
  formContentTypeHeaders = {
    headers: new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    ),
  };

  constructor(private http: HttpClient) {}

  getGroupById(groupId: number): Observable<Group> {
    const results: Observable<Group> = this.http.get<Group>(
      `${this.golferUrl}/${groupId}`
    );
    console.log(`getGroupById() returned ${JSON.stringify(results)}`);
    return results;
  }

  updateGolfer(groupId: number, golfer: Member): Observable<Group> {
    const payload = new HttpParams()
      .set('MemberId', golfer.MemberId)
      .set('MemberName', golfer.MemberName)
      .set('MemberEmail', golfer.MemberEmail)
      .set('MemberPhone', golfer.MemberPhone);

    const results: Observable<Group> = this.http.put<Group>(
      `${this.golferUrl}/${groupId}` + '/members',
      payload,
      this.formContentTypeHeaders
    );
    console.log(`updateGolfer() returned ${JSON.stringify(results)}`);
    return results;
  }

  addGolfer(groupId: number, golfer: Member): Observable<Group> {
    const payload = new HttpParams()
      .set('MemberName', golfer.MemberName)
      .set('MemberEmail', golfer.MemberEmail)
      .set('MemberPhone', golfer.MemberPhone);

    const results: Observable<Group> = this.http.post<Group>(
      `${this.golferUrl}/${groupId}` + '/members',
      payload,
      this.formContentTypeHeaders
    );
    console.log(`addGolfer() returned ${JSON.stringify(results)}`);
    return results;
  }

  deleteGolfer(groupId: number, golferId: number): Observable<void> {
    const results: Observable<void> = this.http.delete<void>(
      `${this.golferUrl}/${groupId}` + '/members/' + `${golferId}`
    );
    console.log(`addGolfer() returned ${JSON.stringify(results)}`);
    return results;
  }
}
