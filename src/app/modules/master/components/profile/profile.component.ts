import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDetailComponent } from '../../../shared/components/base-detail/base-detail.component';
import { UserProfileDto } from '../../../admin/models/user-profile-dto';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { UserService } from '../../../auth/services/user.service';
import { DataStatusEnum } from '../../../shared/models/common-models';
import { takeUntil } from 'rxjs';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { instanceToInstance } from 'class-transformer';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FocusFirstInvalidFieldDirective } from '../../../shared/directives/focus-first-invalid-field.directive';
import { ErrorDetailComponent } from '../../../shared/components/error-detail/error-detail.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, FocusFirstInvalidFieldDirective, ErrorDetailComponent, LoadingComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BaseDetailComponent<UserProfileDto> implements OnInit, OnDestroy {

  constructor(
    private _userService: UserService,
  ) {
    super(_userService);
    this.requiredPermissionType = EnumPermissionFor.USER;
  }

  //#region Init and destroy methods

  override ngOnInit() {
    super.ngOnInit();
    this.setRecordId();
    this.getRecord();
  }

  //#endregion Init and destroy methods

  //#region Load required data from server!

  setRecordId() {
    this.recordId = this._userService.currentUser.id || 0;
    this.isNew = (this.recordId) ? false : true;
  }

  getRecord() {
    if (this.isNew) {
      this.model = this.createNewModelObject();
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    } else {
      this._userService.getUserProfile(this.recordId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<UserProfileDto>) => {
            if (result.data) {
              this.model = instanceToInstance<UserProfileDto>(result.data);
            }
            this.setDetailFormValues();
            this.dataStatus = DataStatusEnum.DataAvailable;
          },
          error: (error: ApiError) => {
            this.dataStatus = DataStatusEnum.Error;
            this.apiError = error;
          }
        }
        );
    }
  }

  //#endregion Load required data from server end!

  //#region Form related methods

  //#region Must override methods

  /**
   * Return new instance of detail view model
   */
  override createNewModelObject(): UserProfileDto {
    let newModel = new UserProfileDto();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  override transferDetailFormValuesToModel(model: UserProfileDto) {
    const detailFormValue = this.detailForm?.value;
    model.fullName = detailFormValue.fullName;
    model.email = detailFormValue.email;
    model.phoneNumber = detailFormValue.phoneNumber;
  }

  /**
   * Create detail form and it's child controls.
   */
  override createForm() {
    this.detailForm = this._formBuilder.group({
      fullName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.pattern(/^\+?[0-9]{10}(?:x.+)?$/)]],
      email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]]
    });
  }

  /**
   * One time value change event subscribe to form control events!
   */
  override setValueChangeEvent() {
    //keep subscribe still not destroy!
    // this.name.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
    //   newValue => {
    //     console.log("name value changed!!");
    //   }
    // );
  }

  //#endregion Must override methods end  

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    if (this.model) {
      this.detailForm?.patchValue({
        fullName: this.model.fullName,
        email: this.model.email,
        phoneNumber: this.model.phoneNumber,
      });
    }
  }

  override onCancel() {
    this._router.navigate(['dashboard']);
  }

  /**
     * perform save data to server if all inputs are valid!
     */
  override onSubmit(): void {
    if (this.model && this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      this._userService.submitUserProfile(this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<UserProfileDto>) => {
            if (result?.eventMessageId) {
              this._userService.showSuccessIdToast(result.eventMessageId);
              this.onCancel();
            }
          },
          error: (error: ApiError) => {
            this.submitted = false;
            this._userService.showApiErrorToast(error);
          }
        }
        );
    }
  }

  //#region Form control properties

  //property for each form control!
  get fullName() {
    return this.detailForm?.get('fullName');
  }
  get email() {
    return this.detailForm?.get('email');
  }
  get phoneNumber() {
    return this.detailForm?.get('phoneNumber');
  }

  //#endregion Form control properties

  //#endregion  Form related methods

  //#region component specific methods

  //#endregion component specific methods

}