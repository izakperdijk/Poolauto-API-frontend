import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PoolautoAPIBackendService {

  constructor(private http: HttpClient) { }

  getLicensePlate(id: string) {
    return this.http.get('/server/' + id);
  }
}
