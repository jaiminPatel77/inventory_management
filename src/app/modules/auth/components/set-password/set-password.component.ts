import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordDto } from '../../models/account-model';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { Validation } from '../../../shared/models/validator';
import { CommonModule } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, SvgIconDirective,CommonModule,NgbTooltip],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  model?: ResetPasswordDto;
  detailForm?: FormGroup;
  isShownPwd: boolean = false;
  isShownConfirmPwd: boolean = false;

  private destroy$ = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    protected _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
  }

  //#region Init and destroy methods
  ngOnInit() {
    this.createForm();
    this.model = this.createNewModelObject();
    this.setValueChangeEvent();

    this._activatedRoute.queryParamMap.subscribe(qparams => {
      if (this.model) {
        this.model.code = qparams.get("code");
      }
    });
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
  createNewModelObject(): ResetPasswordDto {
    let newModel = new ResetPasswordDto();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: ResetPasswordDto) {
    const detailFormValue = this.detailForm?.value;
    model.email = detailFormValue.email;
    model.password = detailFormValue.password;
  }

  /**
   * Create detail form and it's child controls.
   */
  createForm() {
    this.detailForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: [null, [Validators.required, Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()]).{8,}/)]],
      confirmPassword: [null, [Validators.required]]
    }, {
      validators: [Validation.match('password', 'confirmPassword')]
    }
    );
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
  * @param {FormGroup} formGroup formgroup object
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
    if (this.model && this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      this._accountService.resetPassword(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<any>) => {
            if (result.eventMessageId) {
              this._accountService.showSuccessIdToast(result.eventMessageId);
            }
            return this._router.navigateByUrl("/auth/login");
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

  //#region Form control properties
  //property for each form control!

  get email() {
    return this.detailForm?.get('email');
  }
  get password() {
    return this.detailForm?.get('password');
  }
  get confirmPassword() {
    return this.detailForm?.get('confirmPassword');
  }

  //#end region Form control properties

  //#end region  Form related methods

  goToLogin() {
    this._router.navigate(['auth/login']);
  }
}
