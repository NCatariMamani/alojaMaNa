import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OutputService extends HttpService {

  private readonly router: string = ENDPOINT_LINKS.Salidas;
  constructor(private outputRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.outputRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.outputRepo.getById(this.router, id);
  }

  create(model: any): Observable<any> {
    return this.outputRepo.create(this.router, model);
  }

  update(id: string | number, model: any): Observable<Object> {
    return this.outputRepo.updateTypeServices(this.router, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.outputRepo.remove(this.router, id);
  }

}
