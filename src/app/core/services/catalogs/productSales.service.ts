import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { Repository } from 'src/app/common/repository/repository';

@Injectable({
  providedIn: 'root'
})
export class ProductSalesService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.ProductoVentas;
  constructor(private productSalesRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.productSalesRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.productSalesRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.productSalesRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.productSalesRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.productSalesRepo.remove(this.router, id);
  }
}
