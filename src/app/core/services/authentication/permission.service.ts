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
export class PermisionService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.Permisos;
  constructor(private permissionRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.permissionRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.permissionRepo.getById(this.router, id);
  }

  /*getAllHabUserById(id: string | number, params: ListParams): Observable<any> {
    return this.permissionRepo.getById02(`${this.router}/getAllHabUser`, id, params);
  }*/

  create(model: any): Observable<any> {
    return this.permissionRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.permissionRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.permissionRepo.remove(this.router, id);
  }

}

