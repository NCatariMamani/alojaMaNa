import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
/*import {
  IAuthorityIssuingResponse,
  INoCityByAsuntoSAT,
} from 'src/app/core/models/catalogs/authority.model';*/
//import { IOTClaveEntityFederativeByAsuntoSAT } from 'src/app/core/models/catalogs/issuing-institution.model';
//import { INotificationTransferentIndiciadoCity } from 'src/app/core/models/ms-notification/notification.model';
import { environment } from 'src/environments/environment';
import { ListParams } from './interfaces/list-params';
import { IRepository } from './interfaces/repository.interface';

@Injectable({ providedIn: 'root' })
export class Repository<T> implements IRepository<T> {
  constructor(public readonly httpClient: HttpClient) {}
  
  create(route: string, formData: T): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
    //throw new Error('Method not implemented.');
  }
  update(route: string, id: number | string, model: T): Observable<Object> {
    throw new Error('Method not implemented.');
  }
  getAllPaginated(route: string, params: ListParams): Observable<IListResponse<T>> {
    throw new Error('Method not implemented.');
  }
  

  /*getAllPaginated(
    route: string,
    _params?: ListParams | string
  ): Observable<IListResponse<T>> {
  
    if(_params){
      const params = this.makeParams(_params);
    } 
    
    const fullRoute = this.buildRoute(route);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }*/

  getAll(
    route: string,
    _params: ListParams | string
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, {
      params
    });
  }

  getById(route: string, id: number | string): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<T>(`${fullRoute}/${id}`);
  }

  getByIdH(route: string): Observable<T> {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.get<T>(`${fullRoute}`);
  }

  getGeneratePDF(route: string, formData: object): Observable<Blob> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post(`${fullRoute}`,formData,{responseType: 'blob'});
  }

  getById02(route: string, id: number | string, params: ListParams): Observable<IListResponse<T>> {
    const fullRoute = this.buildRoute(route);

    const httpParams = new HttpParams({ fromObject: params as any });
    return this.httpClient.get<IListResponse<T>>(`${fullRoute}/${id}`, {
      params: httpParams,
    });
  }

  newGetById(route: string, id: number | string): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<T>(`${fullRoute}/id/${id}`);
  }

  getGoodByIds(route: string): Observable<T> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<T>(`${fullRoute}`);
  }

  /*create(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.post<T>(`${fullRoute}`, formData);
  }*/

  create3(route: string, formData: Object, _params: ListParams | string) {
    const fullRoute = this.buildRoute(route);
    const params = this.makeParams(_params);
    return this.httpClient.post<T>(`${fullRoute}`, formData, { params });
  }

  /*update(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}/${id}`, formData);
  }*/
  update22(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}`, formData);
  }

  updateTypeServices(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}/${id}`, formData);
  }

  updateClaimConclusion(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}/${id}`, formData);
  }

  updateManegement(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  updateSaveValue(route: string, id: number | string, formData: any) {
    const fullRoute = this.buildRoute(route);
    formData.id = id;
    return this.httpClient.put(`${fullRoute}`, formData);
  }

  updateResponseRepuve(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  updateCatagaloDelegations(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}`, formData);
  }

  newUpdate(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}`, formData);
  }

  newUpdateId(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  remove(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.delete(`${fullRoute}/${id}`);
  }

  remove5(route: string, id: number | string, id2: number | string) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.delete(`${fullRoute}`);
  }

  removeRepuves(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}`, { body: { key: formData } });
  }
  newRemove(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }
  removeDocSac(route: string, formData: any) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}/id/${formData.id}`);
  }

  updateByIds(route: string, ids: Partial<T>, formData: Object) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.put(`${fullRoute}/${idsRoute}`, formData);
  }

  getByIds(route: string, ids: Partial<T>) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.get<T>(`${fullRoute}/${idsRoute}`);
  }

  removeByIds(route: string, ids: Partial<T>) {
    const fullRoute = this.buildRoute(route);
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.delete(`${fullRoute}/${idsRoute}`);
  }

  private buildRoute(route: string) {
    // //
    const paths = route.split('/');
    paths.shift();
    if (paths.length === 0) {
      return `${environment.apiUrl}/${route}`;
    }
    const ms = route.split('/')[0];
    return `${environment.apiUrl}${ms}/${paths.join('/')}`;
  }

  private makeIdsRoute(ids: Partial<T>): string {
    const keysArray = Object.values(ids);
    return keysArray.join('/');
  }

  private makeParams(params: ListParams | string): HttpParams {
    if (typeof params === 'string') {
      return new HttpParams({ fromString: params });
    }
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
  //Temporales
  getAllPaginated2(
    route: string,
    _params: ListParams
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}${route}`,
      { params }
    );
  }

  getById2(route: string, id: number | string): Observable<T> {
    return this.httpClient.get<T>(`${environment.apiUrl}${route}/${id}`);
  }
  getById3(route: string, id: number | string): Observable<IListResponse<T>> {
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}${route}/${id}`
    );
  }
  getById4(
    route: string,
    id: number | string,
    _params?: ListParams
  ): Observable<IListResponse<T>> {
    const params = _params ? this.makeParams(_params) : {};
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}${route}/${id}`,
      { params }
    );
  }

  create2(route: string, formData: Object) {
    return this.httpClient.post<T>(`${environment.apiUrl}${route}`, formData);
  }

  update2(route: string, id: number | string, formData: Object) {
    return this.httpClient.put(
      `${environment.apiUrl}${route}/${id}`,
      formData
    );
  }
  update3(route: string, formData: Object) {
    return this.httpClient.put(`${environment.apiUrl}${route}`, formData);
  }
  remove2(route: string, id: number | string) {
    return this.httpClient.delete(`${environment.apiUrl}${route}/${id}`);
  }
  remove3(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete<T>(`${fullRoute}`, { body: formData });
  }
  updateByIds2(route: string, ids: Partial<T>, formData: Object) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.put(
      `${environment.apiUrl}${route}/${idsRoute}`,
      formData
    );
  }

  getByIds2(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.get<T>(`${environment.apiUrl}${route}/${idsRoute}`);
  }

  removeByIds2(route: string, ids: Partial<T>) {
    const idsRoute: string = this.makeIdsRoute(ids);
    return this.httpClient.delete(`${environment.apiUrl}${route}/${idsRoute}`);
  }

  getByIdDelegationSubdelegation(
    /* route: string, */
    idDelegation: string | number,
    idSubdelegation: string | number
  ): Observable<IListResponse<T>> {
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}catalog/api/v1/departament?limit=5&page=1&filter.numDelegation=${idDelegation}&filter.numSubDelegation=${idSubdelegation}`
    );
  }
  removeByBody(route: string, obj: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.delete(`${fullRoute}`, obj);
  }

  removeDateDocuments(route: string, body?: {}) {
    return this.httpClient.delete(`${environment.apiUrl}${route}`, { body });
  }

  update4(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}`, formData);
  }
  update5(
    route: string,
    id: number | string,
    id1: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(fullRoute);
    return this.httpClient.put(`${fullRoute}/${id}/${id1}`, formData);
  }
  update6(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}`, formData);
  }
  /*getCityByAsuntoSat(
    route: string,
    id: number | string
  ): Observable<INoCityByAsuntoSAT> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<INoCityByAsuntoSAT>(`${fullRoute}/${id}`);
  }
  getOTClaveEntityFederativeByAsuntoSat(
    route: string,
    id: number | string
  ): Observable<IOTClaveEntityFederativeByAsuntoSAT> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IOTClaveEntityFederativeByAsuntoSAT>(
      `${fullRoute}/${id}`
    );
  }
  getOTClaveEntityFederativeByAvePrevia(
    route: string,
    id: number | string
  ): Observable<IOTClaveEntityFederativeByAsuntoSAT> {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get<IOTClaveEntityFederativeByAsuntoSAT>(
      `${fullRoute}/${id}`
    );
  }
  /*getAuthorityIssuingByParams(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.post<IListResponse<IAuthorityIssuingResponse>>(
      `${fullRoute}`,
      formData
    );
  }*/
  /*getNotificacionesByTransferentIndiciadoCity(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.post<INotificationTransferentIndiciadoCity[]>(
      `${fullRoute}`,
      formData
    );
  }*/
  update7(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/${id}`);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}`, formData);
  }
  getClassif(classif: string | number): Observable<IListResponse<T>> {
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}catalog/api/v1/good-sssubtype?filter.numClasifGoods=$eq:${classif}`
    );
  }

  getMenajeInmueble(
    goodClassNumber: string | number
  ): Observable<IListResponse<T>> {
    return this.httpClient.get<IListResponse<T>>(
      `${environment.apiUrl}catalog/api/v1/good-sssubtype?filter.numClasifGoods=$eq:${goodClassNumber}`
    );
  }

  getAllPaginatedFilter(
    route: string,
    _params: ListParams | string
  ): Observable<IListResponse<T>> {
    const params = this.makeParams(_params);
    const fullRoute = this.buildRouteFilter(route);

    return this.httpClient.get<IListResponse<T>>(`${fullRoute}`, { params });
  }

  buildRouteFilter(route: string) {
    const paths = route.split('/');
    paths.shift();
    if (paths.length === 0) {
      return `${environment.apiUrl}notification/api/v1/${route}`;
    }
    const ms = route.split('/')[0];
    return `${environment.apiUrl}${ms}/api/v1/${paths.join('/')}`;
  }

  updateCatalogOpinions(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  removeCatalogOpinions(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/id/${id}`);

    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }

  updateCatalogDocCompensation(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(formData);

    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  removeCatalogDocCompensation(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/id/${id}`);

    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }

  updateCatalogSiabClasification(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(formData);
    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  removeCatalogSiabClasification(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/id/${id}`);

    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }

  updateThirdPartyCompany(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(formData);
    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  removeThirdPartyCompany(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/id/${id}`);

    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }

  updateTypeRelevant(route: string, id: number | string, formData: Object) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  updateTypeRelevant2(route: string, formData: Object) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.put(`${fullRoute}`, formData);
  }

  updateCatalogPhotographMedia(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);

    return this.httpClient.put(`${fullRoute}/id/${id}`, formData);
  }

  removeCatalogPhotographMedia(route: string, id: number | string) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/id/${id}`);

    return this.httpClient.delete(`${fullRoute}/id/${id}`);
  }

  // updateCatalogGoodSituation(route: string, formData: Object) {
  //   const fullRoute = this.buildRoute(route);
  //   console.log('fullRoute ', fullRoute)
  //   console.log('formData ', formData)
  //   return this.httpClient.put(`${fullRoute}`, formData);
  // }

  updateCatalogGoodSituation(
    route: string,
    id: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.put(`${fullRoute}`, formData);
  }

  removeCatalogGoodSituation(
    route: string,
    situation: number | string,
    status: number | string
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(`${fullRoute}/delete/${situation}/${status}`);

    return this.httpClient.delete(`${fullRoute}/delete/${situation}/${status}`);
  }

  update8(
    route: string,
    id: number | string,
    id1: number | string,
    id2: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    // console.log(fullRoute);
    return this.httpClient.put(`${fullRoute}/${id}/${id1}/${id2}`, formData);
  }

  getAll3(
    route: string,
    id: number | string,
    id1: number | string,
    id2: number | string,
    formData: Object
  ) {
    const fullRoute = this.buildRoute(route);
    return this.httpClient.get(`${fullRoute}/${id}/${id1}/${id2}`, formData);
  }

  remove_(route: string, body: any) {
    const fullRoute = this.buildRoute(route);
    console.log(body);
    return this.httpClient.delete(`${fullRoute}`, body);
  }
}
