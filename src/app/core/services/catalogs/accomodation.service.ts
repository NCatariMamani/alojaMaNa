import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Repository } from '../../../common/repository/repository';

@Injectable({
  providedIn: 'root'
})
export class AccomodationService extends HttpService {
  private readonly router: string = ENDPOINT_LINKS.Alojamientos;
  constructor(private accomodationRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.accomodationRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.accomodationRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.accomodationRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.accomodationRepo.update(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.accomodationRepo.remove(this.router, id);
  }


}
