import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Injectable({
  providedIn: 'root'
})
export class SalesService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.Ventas;
  constructor(private salesRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.salesRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.salesRepo.getById(this.router, id);
  }

  getAllVentaClientesById(id: string | number, params: ListParams): Observable<any> {
    return this.salesRepo.getById02(`${this.router}/getVentaCliente`, id, params);
  }

  create(model: any): Observable<any> {
    return this.salesRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.salesRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.salesRepo.remove(this.router, id);
  }

}
