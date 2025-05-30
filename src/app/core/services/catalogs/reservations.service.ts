import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends HttpService {

  private readonly router: string = ENDPOINT_LINKS.Recervaciones;
  constructor(private shoppingRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.shoppingRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.shoppingRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.shoppingRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.shoppingRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.shoppingRepo.remove(this.router, id);
  }

  getPdf(body: any): Observable<Blob> {
    //return this.shoppingRepo.getAll(`${this.router}/generatepdf`, params);
    return this.shoppingRepo.getGeneratePDF(`${this.router}/generatepdf`,body);
  }

  

}
