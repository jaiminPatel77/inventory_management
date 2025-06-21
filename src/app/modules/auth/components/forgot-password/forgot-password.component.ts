import { Component, OnDestroy, OnInit } from '@angular/core';
import { CaptchaSetting, ForgotPasswordRequest } from '../../models/account-model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { AccountService } from '../../services/account.service';
import { environment } from '../../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, SvgIconDirective, NgxCaptchaModule,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  isShown: boolean = false;
  model?: ForgotPasswordRequest;
  detailForm?: FormGroup;
  captchaSetting?: CaptchaSetting;

  private destroy$ = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    protected _router: Router
  ) {
  }

  //#region Init and destroy methods
  ngOnInit() {
    this.createForm();
    this.model = this.createNewModelObject();
    this.setValueChangeEvent();
    this.setDetailFormValues();
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }
  //#endregion Init and destroy methods

  //#region Load required data from server!

  //#endregion Load required data from server end!

  //#region Form related methods

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  createNewModelObject(): ForgotPasswordRequest {
    let newModel = new ForgotPasswordRequest();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: ForgotPasswordRequest) {
    const detailFormValue = this.detailForm?.value;
    model.email = detailFormValue.email;
    model.returnUrl = `${window.location.origin}${environment.Setting.rootURL}auth/set-password`;
    model.secretCode = this.captchaSetting?.response;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      recaptcha: [null, [Validators.required]]
    });
  }

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //keep subscribe still not destroy!
    // this.name.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
    //   newValue => {
    //     console.log("name value changed!!");
    //   }
    // );
  }

  /**
     * validate form controls before submit data to server!
     * by default only validate the detailForm .. in case if any custom validation needed override it.
     */
  validateDetailFormBeforeSubmit(): boolean {
    if (this.detailForm) {
      this.validateAllFormFields(this.detailForm);
      return this.detailForm.valid;
    }
    return false;
  }

  /**
  * Mark all control of a given FormGroup as Touched or dirty so that form will show appropriate error
  * @param {FormGroup} formGroup form group object
  */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
     * perform save data to server if all inputs are valid!
     */
  onSubmit(): void {    
    this.detailForm?.markAllAsTouched();
    if (this.model && this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      this._accountService.forgotPassword(this.model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ApiOkResponse<any>) => {
          return this._router.navigateByUrl("/auth/forgot-password-confirm");
        },
        error: (error: ApiError) => {
          this.submitted = false;
          this._accountService.showApiErrorToast(error);
        }
      }
      );
    }
  }

  /**
   * return true if control is dirty or touched and it's status is invalid.
   * @param {AbstractControl} control any form control object
   */
  isInvalid(control: AbstractControl | null | undefined): boolean { 
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  //#end region Must override methods end

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    if (this.model) {
      this.detailForm?.patchValue({
        email: this.model.email,
        secretCode: null,
      });
      this.captchaSetting = this._accountService.getCaptchaSetting();
    }
  }

  //#region Form control properties
  //property for each form control!

  get email() {
    return this.detailForm?.get('email');
  }
  get recaptcha() {
    return this.detailForm?.get('recaptcha');
  }

  //#end region Form control properties

  //#end region  Form related methods

  //#region Captcha methods
  handleReset(): void {
    if (this.captchaSetting) {
      this.captchaSetting.response = undefined;
      this.captchaSetting.isLoaded = false;
    }
  }

  handleSuccess(captchaResponse: string): void {
    if (this.captchaSetting) {
      this.captchaSetting.response = captchaResponse;
    }
  }

  handleLoad(): void {
    if (this.captchaSetting) {
      this.captchaSetting.isLoaded = true;
    }
  }

  handleExpire(): void {
    if (this.captchaSetting) {
      this.captchaSetting.response = undefined;
    }
  }
  //#endregion  Captcha methods

  goToLogin() {
    this._router.navigate(['auth/login']);
  }
}
