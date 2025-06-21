import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { TrialSiteDto } from '../../models/trial-site-dto';
import { TrialSiteService } from '../../services/trial-site.service';
import { ColumnSorterStoreComponent } from '../../../shared/components/column-sorter-store/column-sorter-store.component';
import { BaseListStoreComponent } from '../../../shared/components/base-list-store/base-list-store.component';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { deleteTrialSite, getTrialSites } from '../../../../store/trialsite/trialsite.actions';
import { getTrialSiteDataStatus, getTrialSiteErrorMessage, getTrialSiteList } from '../../../../store/trialsite/trialsite.selector';
import { instanceToInstance } from 'class-transformer';

@Component({
  selector: 'app-trial-site-list-store',
  standalone: true,
  imports: [TranslateModule, LoadingComponent, FormsModule, NgbPaginationModule, NgbTooltip, SvgIconDirective, ColumnSorterStoreComponent],
  templateUrl: './trial-site-list-store.component.html',
  styleUrl: './trial-site-list-store.component.scss'
})
export class TrialSiteListStoreComponent extends BaseListStoreComponent<TrialSiteDto> {

  nameField: string = 'name';
  nameSearchTxt: string = '';

  constructor(
    private _trialSiteService: TrialSiteService
  ) {
    super(_trialSiteService);
    this.allowMultipleSelect = true;
    this.requiredPermissionType = EnumPermissionFor.TrialSite;
  }

  override setFilterValuesToModel() {
    let isExistNameField = this.filters.find(e => e.filterName === this.nameField);
    if (isExistNameField) {
      this.nameSearchTxt = isExistNameField.filterVal;
    }
  }

  override get dispatchSelectorForGettingList(): any {
    return getTrialSites();
  }

  override get getStoreListSelector(): any {
    return getTrialSiteList;
  }

  override get getStoreListStatusSelector(): any {
    return getTrialSiteDataStatus;
  }

  override get getStoreListErrorSelector(): any {
    return getTrialSiteErrorMessage;
  }

  override afterDataLoaded() {
    let list = instanceToInstance<TrialSiteDto[]>(this.list);
    this.filteredList = list.filter(e => (e.name)?.toLocaleLowerCase()?.includes(this.nameSearchTxt.toLocaleLowerCase()));
    this.onSortingList(this.sortingState);
  }

  override clearModelValuesOnFilter() {
    this.nameSearchTxt = '';
  }

  onNameSearch() {
    super.onFilter(this.nameField, this.nameSearchTxt);
  }

  override onDeleteRecord(record: TrialSiteDto) {
    let findObj = this.paginatedList.find(e => e.id === record.id);
    if (findObj) {
      let newObj = instanceToInstance<TrialSiteDto>(findObj);
      this._store.dispatch(deleteTrialSite({ trialSite: newObj }));
    }
  }

  // onCreateTrialSite() {
  //   this._store.dispatch(createTrialSite({ trialSite: new TrialSiteDto() }));
  // }

  // onUpdateTrialSite(record: TrialSiteDto) {
  //   this._store.dispatch(updateTrialSite({ trialSite: record }));
  // }

  // onDeleteTrialSite(record: TrialSiteDto) {
  //   this._store.dispatch(deleteTrialSite({ trialSite: record }));
  // }

}
