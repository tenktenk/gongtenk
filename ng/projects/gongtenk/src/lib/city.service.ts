// generated by ng_file_service_ts
import { Injectable, Component, Inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT, Location } from '@angular/common'

/*
 * Behavior subject
 */
import { BehaviorSubject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CityDB } from './city-db';

// insertion point for imports
import { CountryDB } from './country-db'

@Injectable({
  providedIn: 'root'
})
export class CityService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Kamar Raïmo: Adding a way to communicate between components that share information
  // so that they are notified of a change.
  CityServiceChanged: BehaviorSubject<string> = new BehaviorSubject("");

  private citysUrl: string

  constructor(
    private http: HttpClient,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    // path to the service share the same origin with the path to the document
    // get the origin in the URL to the document
    let origin = this.document.location.origin

    // if debugging with ng, replace 4200 with 8080
    origin = origin.replace("4200", "8080")

    // compute path to the service
    this.citysUrl = origin + '/api/github.com/thomaspeugeot/gongtenk/go/v1/citys';
  }

  /** GET citys from the server */
  getCitys(): Observable<CityDB[]> {
    return this.http.get<CityDB[]>(this.citysUrl)
      .pipe(
        tap(_ => this.log('fetched citys')),
        catchError(this.handleError<CityDB[]>('getCitys', []))
      );
  }

  /** GET city by id. Will 404 if id not found */
  getCity(id: number): Observable<CityDB> {
    const url = `${this.citysUrl}/${id}`;
    return this.http.get<CityDB>(url).pipe(
      tap(_ => this.log(`fetched city id=${id}`)),
      catchError(this.handleError<CityDB>(`getCity id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new city to the server */
  postCity(citydb: CityDB): Observable<CityDB> {

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)
    citydb.Country = new CountryDB

    return this.http.post<CityDB>(this.citysUrl, citydb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`posted citydb id=${citydb.ID}`)
      }),
      catchError(this.handleError<CityDB>('postCity'))
    );
  }

  /** DELETE: delete the citydb from the server */
  deleteCity(citydb: CityDB | number): Observable<CityDB> {
    const id = typeof citydb === 'number' ? citydb : citydb.ID;
    const url = `${this.citysUrl}/${id}`;

    return this.http.delete<CityDB>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted citydb id=${id}`)),
      catchError(this.handleError<CityDB>('deleteCity'))
    );
  }

  /** PUT: update the citydb on the server */
  updateCity(citydb: CityDB): Observable<CityDB> {
    const id = typeof citydb === 'number' ? citydb : citydb.ID;
    const url = `${this.citysUrl}/${id}`;

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)
    citydb.Country = new CountryDB

    return this.http.put<CityDB>(url, citydb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`updated citydb id=${citydb.ID}`)
      }),
      catchError(this.handleError<CityDB>('updateCity'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {

  }
}
