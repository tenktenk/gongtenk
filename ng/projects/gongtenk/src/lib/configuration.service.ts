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

import { ConfigurationDB } from './configuration-db';

// insertion point for imports

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Kamar Raïmo: Adding a way to communicate between components that share information
  // so that they are notified of a change.
  ConfigurationServiceChanged: BehaviorSubject<string> = new BehaviorSubject("");

  private configurationsUrl: string

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
    this.configurationsUrl = origin + '/api/github.com/tenktenk/gongtenk/go/v1/configurations';
  }

  /** GET configurations from the server */
  getConfigurations(): Observable<ConfigurationDB[]> {
    return this.http.get<ConfigurationDB[]>(this.configurationsUrl)
      .pipe(
        tap(_ => this.log('fetched configurations')),
        catchError(this.handleError<ConfigurationDB[]>('getConfigurations', []))
      );
  }

  /** GET configuration by id. Will 404 if id not found */
  getConfiguration(id: number): Observable<ConfigurationDB> {
    const url = `${this.configurationsUrl}/${id}`;
    return this.http.get<ConfigurationDB>(url).pipe(
      tap(_ => this.log(`fetched configuration id=${id}`)),
      catchError(this.handleError<ConfigurationDB>(`getConfiguration id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new configuration to the server */
  postConfiguration(configurationdb: ConfigurationDB): Observable<ConfigurationDB> {

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)

    return this.http.post<ConfigurationDB>(this.configurationsUrl, configurationdb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`posted configurationdb id=${configurationdb.ID}`)
      }),
      catchError(this.handleError<ConfigurationDB>('postConfiguration'))
    );
  }

  /** DELETE: delete the configurationdb from the server */
  deleteConfiguration(configurationdb: ConfigurationDB | number): Observable<ConfigurationDB> {
    const id = typeof configurationdb === 'number' ? configurationdb : configurationdb.ID;
    const url = `${this.configurationsUrl}/${id}`;

    return this.http.delete<ConfigurationDB>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted configurationdb id=${id}`)),
      catchError(this.handleError<ConfigurationDB>('deleteConfiguration'))
    );
  }

  /** PUT: update the configurationdb on the server */
  updateConfiguration(configurationdb: ConfigurationDB): Observable<ConfigurationDB> {
    const id = typeof configurationdb === 'number' ? configurationdb : configurationdb.ID;
    const url = `${this.configurationsUrl}/${id}`;

    // insertion point for reset of pointers and reverse pointers (to avoid circular JSON)

    return this.http.put<ConfigurationDB>(url, configurationdb, this.httpOptions).pipe(
      tap(_ => {
        // insertion point for restoration of reverse pointers
        this.log(`updated configurationdb id=${configurationdb.ID}`)
      }),
      catchError(this.handleError<ConfigurationDB>('updateConfiguration'))
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
