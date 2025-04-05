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
export class RolePermissionsService extends HttpService {

  private readonly router: string = ENDPOINT_LINKS.RolePermissions;
  constructor(private rolePermiRepo: Repository<any>) {
    super();
  }
  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.rolePermiRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.rolePermiRepo.getById(this.router, id);
  }

  /*getAllHabUserById(id: string | number, params: ListParams): Observable<any> {
    return this.rolePermiRepo.getById02(`${this.router}/getAllHabUser`, id, params);
  }*/

  create(model: any): Observable<any> {
    return this.rolePermiRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.rolePermiRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.rolePermiRepo.remove(this.router, id);
  }

}
