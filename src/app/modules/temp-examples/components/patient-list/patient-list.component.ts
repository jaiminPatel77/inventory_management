import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BaseListComponent } from '../../../shared/components/base-list/base-list.component';
import { PatientListDto } from '../../models/patient-dto';
import { PatientService } from '../../services/patient.service';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { SourceInfo } from '../../../shared/models/table-conf';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TrialSiteService } from '../../services/trial-site.service';
import { BaseService } from '../../../shared/services/base.service';
import { DataStatusEnum } from '../../../shared/models/common-models';
import { takeUntil } from 'rxjs';
import { TrialSiteLookUpDto } from '../../models/trial-site-dto';
import { ApiError } from '../../../shared/models/api-response';
import { instanceToInstance } from 'class-transformer';
import { ListHelper } from '../../../shared/models/list-helper';
import { ConstString } from '../../../shared/models/const-string';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { ColumnSorterComponent } from '../../../shared/components/column-sorter/column-sorter.component';
import { PatientStatusPipe } from '../../../shared/pipes/patient-status.pipe';
import { AllocationGroupPipe } from '../../../shared/pipes/allocation-group.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [TranslateModule, LoadingComponent, FormsModule, NgbPaginationModule, NgbTooltip, SvgIconDirective, ColumnSorterComponent, PatientStatusPipe, AllocationGroupPipe, NgSelectModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent extends BaseListComponent<PatientListDto> implements OnInit, OnDestroy {

  nameField: string = 'patientId';
  nameSearchTxt: string = '';
  trialSiteIdField: string = 'trialSiteId';
  selectedTrialSiteId?: number;
  trialSiteNameField: string = 'name';

  trialSiteSourceInfo!: SourceInfo;

  // inject services
  private _trialsiteService = inject(TrialSiteService);

  constructor(
    private _patientService: PatientService
  ) {
    super(_patientService);
    this.allowMultipleSelect = true;
    this.requiredPermissionType = EnumPermissionFor.Patient;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getTrialSiteLookupList();
  }

  //#region filter starts

  override setFilterValuesToModel(sourceInfo: SourceInfo) {
    let isExistNameField = sourceInfo.filters.find(e => e.filterName === this.nameField);
    if (isExistNameField) {
      this.nameSearchTxt = isExistNameField.filterVal;
    }
    let isExistTrialSiteField = sourceInfo.filters.find(e => e.filterName === this.trialSiteIdField);
    if (isExistTrialSiteField) {
      this.selectedTrialSiteId = Number(isExistTrialSiteField.filterVal);
    }
  }

  onNameSearch() {
    super.onFilter(this.nameField, this.nameSearchTxt);
  }

  onTrialSiteChange(event: any) {
    super.onFilter(this.trialSiteIdField, event?.toString(), ConstString.EqSplit);
  }

  //#endregion filter ends


  //#region trial site lookup list

  getTrialSiteLookupList() {
    this.trialSiteSourceInfo = new SourceInfo();
    this.trialSiteSourceInfo._service = <BaseService<any>>(this._trialsiteService);
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
  }

  afterLoadedDataForTrialSiteSubscription(sourceInfo: SourceInfo) {
    sourceInfo.afterLoadedData.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: TrialSiteLookUpDto[]) => {
        let trialSiteData = instanceToInstance<TrialSiteLookUpDto[]>(data);
        sourceInfo.list.push(...trialSiteData);
        if (sourceInfo.pagination.pageSize * sourceInfo.pagination.pageNo < sourceInfo.pagination.totalRecords) {
          sourceInfo.pagination.pageNo = sourceInfo.pagination.pageNo + 1;
          ListHelper.updatePaginationQuery(sourceInfo);
          sourceInfo.filterChanged.next('');
        } else {
          this.makeDataAvailableForTrialSite(sourceInfo);
        }
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

  onSearchTrialSite(event: any) {
    ListHelper.onFilter(this.trialSiteSourceInfo, this.trialSiteNameField, event.term);
  }

  makeDataAvailableForTrialSite(sourceInfo: SourceInfo) {
    sourceInfo.gridDataStatus = DataStatusEnum.DataAvailable;
    sourceInfo.list.forEach(element => {
      element.$displayName = `${element.name} - (${element.code})`;
    });
    this.makeFinalDataAvailable();
  }

  //#endregion


  //#region override methods starts

  override onClearFilter() {
    this.nameSearchTxt = '';
    this.selectedTrialSiteId = undefined;
    super.onClearFilter();
  }

  override makeFinalDataAvailable() {
    if (this.sourceInfo.gridDataStatus === DataStatusEnum.DataAvailable &&
      this.trialSiteSourceInfo.gridDataStatus === DataStatusEnum.DataAvailable) {
      this.dataStatus = DataStatusEnum.DataAvailable;
    }
  }

  //#endregion override methods ends
}