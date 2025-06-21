import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiOkResponse, ApiError } from '../../../shared/models/api-response';
import { LoginViewModel } from '../../models/account-model';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { CommonModule } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, SvgIconDirective,CommonModule,NgbTooltip],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  isShown: boolean = false;
  model?: LoginViewModel;
  detailForm?: FormGroup;

  private destroy$ = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    protected _router: Router
  ) {
    super(_authService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.model = new LoginViewModel();
    this.model.deviceId = (new Date()).toUTCString();
    this.createForm();
    this.setValueChangeEvent();
    this.setDetailFormValues();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  /**
   * perform submit data to server  if all inputs are valid!
   */
  onSubmit(): void {
    this.detailForm?.markAllAsTouched();
    if (this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel();
      if (this.model) {
        this._authService.login(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<any>) => {
            if (result?.eventMessageId) {
              this._authService.showSuccessIdToast(result?.eventMessageId);
              this._router.navigateByUrl(this._authService.redirectUrl);
            }
          },
          error: (error: ApiError) => {
            this.submitted = false;
            this._authService.showApiErrorToast(error);
          }
        }
        );
      }
    }
  }

  //#region Form related methods

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: [null, [Validators.required]],
      rememberMe: [false]
    });
  }

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    if (this.model) {
      this.detailForm?.patchValue({
        email: this.model.email,
        password: this.model.password,
        rememberMe: this.model.rememberMe ?? false,
      });
    }
  }

  /**
   * prefer model object from value input in form controls
   */
  transferDetailFormValuesToModel() {
    if (this.model && this.detailForm) {
      const detailFormValue = this.detailForm.value;
      this.model.email = detailFormValue.email;
      this.model.password = detailFormValue.password;
      this.model.rememberMe = detailFormValue.rememberMe;
    }

  }


  //#region Form control change events

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {

  }
  //#endregion


  /**
   * validate form controls before submit data to server!
   */
  validateDetailFormBeforeSubmit(): boolean {
    this.detailForm?.markAsTouched();
    return this.detailForm?.valid ?? true;
  }

  //#region Form control properties

  //property for each form control!
  get email() {
    return this.detailForm?.get('email');
  }
  get password() {
    return this.detailForm?.get('password');
  }
  get rememberMe() {
    return this.detailForm?.get('rememberMe');
  }
  //#endregion 

  //#endregion  
}