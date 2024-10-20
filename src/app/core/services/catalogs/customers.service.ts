import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends HttpService {

  private readonly router: string = ENDPOINT_LINKS.Clientes;
  constructor(private customerRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.customerRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.customerRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.customerRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.customerRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.customerRepo.remove(this.router, id);
  }

}
