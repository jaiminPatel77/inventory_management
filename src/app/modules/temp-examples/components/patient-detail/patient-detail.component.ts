import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientDto } from '../../models/patient-dto';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { Observable, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { TrialSiteService } from '../../services/trial-site.service';
import { PatientService } from '../../services/patient.service';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { BaseDetailComponent } from '../../../shared/components/base-detail/base-detail.component';
import { TrialSiteLookUpDto } from '../../models/trial-site-dto';
import { instanceToInstance } from 'class-transformer';
import { DataStatusEnum } from '../../../shared/models/common-models';
import { BaseLookUpDto } from '../../../shared/models/base-model';
import { SourceInfo } from '../../../shared/models/table-conf';
import { BaseService } from '../../../shared/services/base.service';
import { ListHelper } from '../../../shared/models/list-helper';
import { ConstString } from '../../../shared/models/const-string';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorDetailComponent } from '../../../shared/components/error-detail/error-detail.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FocusFirstInvalidFieldDirective } from '../../../shared/directives/focus-first-invalid-field.directive';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, NgSelectModule, FocusFirstInvalidFieldDirective, ErrorDetailComponent, LoadingComponent, CommonModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss'
})
export class PatientDetailComponent extends BaseDetailComponent<PatientDto> implements OnInit, OnDestroy {

  allocationGroupLookupList: BaseLookUpDto[] = [];
  trialSiteSourceInfo!: SourceInfo;
  trialSiteIdField: string = 'id';
  trialSiteNameField: string = 'name';

  // inject services
  protected _trialSiteService = inject(TrialSiteService);
  isCalledFromInitial: boolean = true;

  constructor(
    private _patientService: PatientService,
  ) {
    super(_patientService);
    this.requiredPermissionType = EnumPermissionFor.Patient;
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
      this.getTrialsiteLookupList();
    } else {
      this._patientService.getRecord(this.recordId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<PatientDto>) => {
            if (result.data) {
              this.model = instanceToInstance<PatientDto>(result.data);
            }
            this.getTrialsiteLookupList();
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
  override createNewModelObject(): PatientDto {
    let newModel = new PatientDto();
    return newModel;
  }

  /**
   * prefer model object from value input in form controls 
   */
  override transferDetailFormValuesToModel(model: PatientDto) {
    const detailFormValue = this.detailForm?.value;
    model.firstName = detailFormValue.firstName;
    model.lastName = detailFormValue.lastName;
    model.trialSiteId = detailFormValue.trialSiteId;
    model.dailyCigarettesCount = isNaN(detailFormValue.dailyCigarettesCount) ? 0 : parseInt(detailFormValue.dailyCigarettesCount);
    model.patientId = detailFormValue.patientId;
    model.enumAllocatedGroup = detailFormValue.enumAllocatedGroup;
  }

  /**
   * Create detail form and it's child controls.
   */
  override createForm() {
    this.detailForm = this._formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      trialSiteId: [null, [Validators.required]],
      patientId: [null],
      enumAllocatedGroup: [null],
      dailyCigarettesCount: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  /**
   * One time value change event subscribe to form control events!
   */
  override setValueChangeEvent() {
    //keep subscribe still not destroy!
    this.firstName?.valueChanges.pipe(debounceTime(50), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        if (this.firstName?.valid && newValue.trim() !== '') {
          const val = newValue.toUpperCase();
          this.firstName.patchValue(val);
        }
      }
    );

    this.lastName?.valueChanges.pipe(debounceTime(50), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(
      newValue => {
        if (this.lastName?.valid && newValue.trim() !== '') {
          const val = newValue.toUpperCase();
          this.lastName.patchValue(val);
        }
      }
    );
  }

  override showSuccessMsgToaster(result: ApiOkResponse<any>) {
    let message: string = '';
    if (this.isNew) {
      message = `${this._patientService._commonService.translateService.instant('PATIENT_WITH_SUBJECTID')} ${result.data.patientId} ${this._patientService._commonService.translateService.instant('CREATED_SUCESSFULLY')}`;
    } else {
      message = result.eventMessageId || '';
    }
    this.baseService.showSuccessIdToast(message);
  }

  //#endregion Must override methods end  

  /**
   * transfer model values to form control
   */
  setDetailFormValues() {
    if (this.model) {
      this.detailForm?.patchValue({
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        trialSiteId: this.model.trialSiteId,
        patientId: this.model.patientId,
        enumAllocatedGroup: this.model.enumAllocatedGroup,
        dailyCigarettesCount: this.model.dailyCigarettesCount
      });
    }
  }

  //#region Form control properties

  //property for each form control!
  get firstName() {
    return this.detailForm?.get('firstName');
  }

  get lastName() {
    return this.detailForm?.get('lastName');
  }

  get trialSiteId() {
    return this.detailForm?.get('trialSiteId');
  }

  get patientId() {
    return this.detailForm?.get('patientId');
  }

  get enumAllocatedGroup() {
    return this.detailForm?.get('enumAllocatedGroup');
  }

  get dailyCigarettesCount() {
    return this.detailForm?.get('dailyCigarettesCount');
  }

  //#endregion Form control properties

  //#endregion  Form related methods


  //#region component specific methods

  getAllocationGroupList() {
    this.allocationGroupLookupList = this._patientService.getAllocationGroupLookupList();
  }

  //#region trial site lookup list starts

  getTrialsiteLookupList() {
    this.trialSiteSourceInfo = new SourceInfo();
    this.trialSiteSourceInfo._service = <BaseService<any>>(this._trialSiteService);
    this.trialSiteSourceInfo.gridDataStatus = DataStatusEnum.Fetching;
    this.applyFilterBeforeTrialSiteListCalled(this.trialSiteSourceInfo);
    this.loadDataFromServerSubscription(this.trialSiteSourceInfo);
    this.afterLoadedDataForTrialSiteSubscription(this.trialSiteSourceInfo);
    this.afterLoadedErrorForTrialSiteSubscription(this.trialSiteSourceInfo);
    this.trialSiteSourceInfo.filterChanged.next('');
  }

  applyFilterBeforeTrialSiteListCalled(sourceInfo: SourceInfo) {
    sourceInfo.pagination.pageNo = 1;
    sourceInfo.pagination.pageSize = 20;
    sourceInfo.apiName = 'lookup-list';
    sourceInfo.paginationQuery = ListHelper.getPaginationQuery(sourceInfo);

    if (this.model?.trialSiteId) {
      sourceInfo.filters = [
        { filterName: this.trialSiteIdField, filterVal: (this.model.trialSiteId).toString(), operator: ConstString.EqSplit, splitOp: '' }
      ];
      if (sourceInfo.filters?.length) {
        let filterStr = ListHelper.getFilterStrFromFilters(sourceInfo);
        sourceInfo.filterQuery = `&${ConstString.FilterStr}=${filterStr}`;
      }
    }
  }

  loadDataFromServerSubscription(sourceInfo: SourceInfo) {
    sourceInfo.filterChanged.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.getList(sourceInfo).pipe(map((response: any) => {
          sourceInfo.pagination.totalRecords = response?.data?.totalRecords;
          return response.data.items;
        })).subscribe({
          next: (response: TrialSiteLookUpDto[]) => {
            sourceInfo.afterLoadedData.next(response);
          },
          error: (error: ApiError) => {
            sourceInfo.afterLoadedError.next(error);
          }
        })
      }
    })
  }

  getList(sourceInfo: SourceInfo): Observable<ApiOkResponse<any>> {
    let url = `/${sourceInfo.apiName}${sourceInfo.paginationQuery}${sourceInfo.filterQuery}${sourceInfo.sortQuery}`;
    return (<BaseService<any>>sourceInfo._service).getResponse<any>((<BaseService<any>>sourceInfo._service).baseUrl, url);
  }

  afterLoadedDataForTrialSiteSubscription(sourceInfo: SourceInfo) {
    sourceInfo.afterLoadedData.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: TrialSiteLookUpDto[]) => {
        let trialSiteData = instanceToInstance<TrialSiteLookUpDto[]>(data);
        sourceInfo.list.push(...trialSiteData);
        this.makeDataAvailableForTrialSite(sourceInfo);
      }
    })
  }

  afterLoadedErrorForTrialSiteSubscription(sourceInfo: SourceInfo) {
    sourceInfo.afterLoadedError.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ApiError) => {
        sourceInfo.list = [];
        this.makeDataAvailableForTrialSite(sourceInfo);
        sourceInfo._service?.showApiErrorToast(data);
      }
    })
  }

  makeDataAvailableForTrialSite(sourceInfo: SourceInfo) {
    sourceInfo.gridDataStatus = DataStatusEnum.DataAvailable;
    sourceInfo.list.forEach(element => {
      element.$displayName = `${element.name} - (${element.code})`;
    });
    this.makeFinalDataAvailable();
  }

  makeFinalDataAvailable() {
    if (this.trialSiteSourceInfo.gridDataStatus === DataStatusEnum.DataAvailable) {
      if (this.isCalledFromInitial) {
        this.isCalledFromInitial = false;
        this.setDetailFormValues();
      }
      this.dataStatus = DataStatusEnum.DataAvailable;
    }
  }

  onSearchTrialSite(event: any) {
    ListHelper.onFilter(this.trialSiteSourceInfo, this.trialSiteNameField, event.term);
  }

  //#endregion trial site lookup list ends

  //#endregion component specific methods

}