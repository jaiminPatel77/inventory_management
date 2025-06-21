import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDetailComponent } from '../../../shared/components/base-detail/base-detail.component';
import { TrialSiteDto } from '../../models/trial-site-dto';
import { TrialSiteService } from '../../services/trial-site.service';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { takeUntil } from 'rxjs';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { instanceToInstance } from 'class-transformer';
import { DataStatusEnum } from '../../../shared/models/common-models';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FocusFirstInvalidFieldDirective } from '../../../shared/directives/focus-first-invalid-field.directive';
import { ErrorDetailComponent } from '../../../shared/components/error-detail/error-detail.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-trial-site-detail',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, FocusFirstInvalidFieldDirective, ErrorDetailComponent, LoadingComponent, CommonModule],
  templateUrl: './trial-site-detail.component.html',
  styleUrl: './trial-site-detail.component.scss'
})
export class TrialSiteDetailComponent extends BaseDetailComponent<TrialSiteDto> implements OnInit, OnDestroy {

  constructor(
    private _trialSiteService: TrialSiteService
  ) {
    super(_trialSiteService);
    this.requiredPermissionType = EnumPermissionFor.TrialSite;
  }

  //#region Init and destroy methods

  override ngOnInit() {
    super.ngOnInit();
    this.getRecord();
  }

  //#endregion Init and destroy methods  

  //#region Load required data from server!

  getRecord() {
    if (this.isNew) {
      this.model = this.createNewModelObject();
      this.setDetailFormValues();
      this.dataStatus = DataStatusEnum.DataAvailable;
    } else {
      this._trialSiteService.getRecord(this.recordId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<TrialSiteDto>) => {
            if (result.data) {
              this.model = instanceToInstance<TrialSiteDto>(result.data);
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
  override createNewModelObject(): TrialSiteDto {
    let newModel = new TrialSiteDto();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  override transferDetailFormValuesToModel(model: TrialSiteDto) {
    const detailFormValue = this.detailForm?.value;
    model.name = detailFormValue.name;
    model.code = (detailFormValue.code) ? detailFormValue.code.toUpperCase() : detailFormValue.code;
    model.hospitalName = detailFormValue.hospitalName;
  }

  /**
   * Create detail form and it's child controls.
   */
  override createForm() {
    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      hospitalName: [null, [Validators.required]]
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
        name: this.model.name,
        code: this.model.code,
        hospitalName: this.model.hospitalName
      });
    }
  }

  //#region Form control properties

  //property for each form control!
  get name() {
    return this.detailForm?.get('name');
  }
  get hospitalName() {
    return this.detailForm?.get('hospitalName');
  }
  get code() {
    return this.detailForm?.get('code');
  }
  //#endregion Form control properties

  //#endregion  Form related methods

}