import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListParams } from '../repository/interfaces/list-params';
import { HttpHeaders } from '@angular/common/http';

interface ObjectParams {
  [param: string]:
  | string
  | number
  | boolean
  | readonly (string | number | boolean)[];
}

export type _Params = string | HttpParams | ListParams | ObjectParams;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  protected readonly url = environment.apiUrl;
  protected readonly prefix = environment.apiUrl;
  protected httpClient = inject(HttpClient);
  protected microservice?: string;
  constructor() { }

  protected get<T = any>(route: string, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    const headers = this.getAuthHeaders();
    return this.httpClient.get<T>(`${url}`, { params, headers });
  }
  protected get2<T = any>(route: string, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.get<T>(`${url}`);
  }

  protected post<T = any>(route: string, body: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    // console.log('url', url);
    return this.httpClient.post<T>(`${url}`, body, { params });
  }

  protected put<T = any>(route: string, body?: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    // console.log(url, params);
    return this.httpClient.put<T>(`${url}`, body, { params });
  }

  /*protected update<T = any>(route: string, body?: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.put<T>(`${url}`, body, { params });
  }*/

  protected patch<T = any>(route: string, body: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    return this.httpClient.patch<T>(`${url}`, body, { params });
  }

  protected delete<T = any>(route: string, body?: {}, _params?: _Params) {
    const params = this.getParams(_params);
    const url = this.buildRoute(route);
    // console.log(url);
    return this.httpClient.delete<T>(`${url}`, { params, body });
  }

  /**
   *
   * @param route endpoint que va despues de ....api/v1
   * @returns regresa la ruta completa: 'http://sigebimsqa.indep.gob.mx/microservice/api/{route}'
   */
  protected buildRoute(route: string): string {
    // console.log(route);
    return `${this.url}${this.microservice}/${this.prefix}${route}`;
  }

  /**
   *
   * @param rawParams query params de la ruta
   * @returns regresa una instancia de HttpParams
   */
  protected getParams(rawParams?: _Params) {
    if (rawParams instanceof HttpParams) {
      return rawParams;
    }

    if (typeof rawParams === 'string') {
      return new HttpParams({ fromString: rawParams });
    }

    if (rawParams instanceof ListParams) {
      return new HttpParams({ fromObject: rawParams });
    }

    return new HttpParams({ fromObject: rawParams });
  }

  protected validationForkJoin(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(token);
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }
}
