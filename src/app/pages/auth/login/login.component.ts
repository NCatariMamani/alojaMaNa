import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
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
    private http: HttpClient
  ) {
    super();
    this.authService.getTokenObservable().subscribe(token => {
      this.token = token;
    });
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
    //event.preventDefault();
    this.authService.login(this.loginForm.controls['email'].value,this.loginForm.controls['password'].value).subscribe({
      next: () => {
        this.loading = false;
        console.log('entraste');
        this.router.navigate(['/pages/catalogs/accommodations']);
      }, error: (err) => {
        this.loading = false;
        this.alert('error', 'Credenciales Incorrectas', ``);
      }
    });
  }

}
