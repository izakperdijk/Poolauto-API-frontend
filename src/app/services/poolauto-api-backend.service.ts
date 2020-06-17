import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PoolautoAPIBackendService {

  constructor(private http: HttpClient) { }

  getLicensePlate(id: string) {
    return this.http.get('http://localhost:8080/' + id)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error.
      errorMsg = 'Client-server communication error: ' + error.error.message;
    } else {
      // Backend returned an unsuccessful response code.
      switch (error.status) {
        case 400: // Illegal format
        case 404: // No data available for query.
          errorMsg = error.error.message;
          break;
        default: // f.i. 504 Gateway Timeout Error
          errorMsg = error.status +
            ' Error, please try again in a few minutes. ' +
            'If the problem persists, please contact an administrator.';
          break;
      }
    }
    return throwError(errorMsg);
  }

}
