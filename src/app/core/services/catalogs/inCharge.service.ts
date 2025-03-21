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
export class InChargeService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.Encargados;
  constructor(private usersRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.usersRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.usersRepo.getById(this.router, id);
  }

  getAllHabUserById(id: string | number, params: ListParams): Observable<any> {
    return this.usersRepo.getById02(`${this.router}/getByEncargadoUser`, id, params);
  }

  
  create(model: any): Observable<any> {
    return this.usersRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.usersRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.usersRepo.remove(this.router, id);
  }

}
