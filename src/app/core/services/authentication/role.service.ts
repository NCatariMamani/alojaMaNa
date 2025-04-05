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
export class RoleService extends HttpService{

  private readonly router: string = ENDPOINT_LINKS.Roles;
  constructor(private roleRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.roleRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.roleRepo.getById(this.router, id);
  }

  /*getAllHabUserById(id: string | number, params: ListParams): Observable<any> {
    return this.roleRepo.getById02(`${this.router}/getAllHabUser`, id, params);
  }*/

  create(model: any): Observable<any> {
    return this.roleRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.roleRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.roleRepo.remove(this.router, id);
  }

}

