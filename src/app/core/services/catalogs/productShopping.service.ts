import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductShoppingService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.ProductoCompras;
  constructor(private productShoppingRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.productShoppingRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.productShoppingRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.productShoppingRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.productShoppingRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.productShoppingRepo.remove(this.router, id);
  }

}
