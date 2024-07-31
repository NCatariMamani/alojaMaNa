import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/common/services/authentication/form-data.service';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
//import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends BasePage implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  showPassword: boolean = false;
  deleteClass: boolean = true;


  //username: string = '';
  //password: string = '';
  token: string | null = null;
  data: any = null;


  constructor(
    private formBuilder: FormBuilder,
    //private authService: AuthService,
    private router: Router,
    //private elementRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService, 
    private http: HttpClient,
    private formDataService: FormDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.renderer.listen('window', 'click', (event: Event) => {
      this.deleteClass = false;
    });
  }

  onSubmit() {
    this.loading = true;
    let { email, password } = this.loginForm.value;
    let token: any;
    let roles: any; //RolesModel;

    if (this.loginForm.valid) {
      this.formDataService.setFormData(this.loginForm.value);
    }

    //event.preventDefault();
    this.authService.login(email,password).subscribe({
      next: data => {
        token = data;
      }, complete: () =>{

        this.loading = false;
          console.log('entraste');
          this.router.navigate(['pages/catalogs/accommodations']);

        /*if(this.authService.existToken()){

          this.loading = false;
          console.log('entraste');
          this.router.navigate(['pages/catalogs/accommodations']);
        }*/
      }, error: (err) => {
        this.loading = false;
        this.alert('error', 'Credenciales Incorrectas', ``);
      }
    });
  }

}
