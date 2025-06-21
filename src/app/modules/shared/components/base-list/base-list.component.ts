import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BaseDto } from '../../models/base-model';
import { BaseComponent } from '../base/base.component';
import { Observable, Subject, debounceTime, map, takeUntil } from 'rxjs';
import { DataStatusEnum, IBaseList } from '../../models/common-models';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../../services/base.service';
import { FilterModel, FilterStrWithOperatorModel, SortingModel, SourceInfo } from '../../models/table-conf';
import { ConstString } from '../../models/const-string';
import { ApiError, ApiOkResponse } from '../../models/api-response';
import { instanceToInstance } from 'class-transformer';
import { ConfirmDialogPopupComponent } from '../confirm-dialog-popup/confirm-dialog-popup.component';
import { ListHelper } from '../../models/list-helper';

@Component({
  selector: 'app-base-list',
  standalone: true,
  imports: [],
  templateUrl: './base-list.component.html',
  styleUrl: './base-list.component.scss'
})
export class BaseListComponent<T extends BaseDto> extends BaseComponent implements OnInit, OnDestroy {

  allowMultipleSelect: boolean = false;
  selectedRecord?: T;
  selectedRecordList?: T[];
  selectAll: boolean = false;
  protected destroy$ = new Subject<boolean>();

  sourceInfo: SourceInfo = new SourceInfo();

  // inject services
  protected _router = inject(Router);
  protected _activatedRoute = inject(ActivatedRoute);

  constructor(
    private _baseService: BaseService<any>) {
    super(_baseService);
    this.selectedRecordList = [];
    this.sourceInfo._service = this._baseService;
  }

  //#region Init and destroy methods starts

  override ngOnInit() {
    super.ngOnInit();
    this.getDataList(this.sourceInfo);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.destroy$) {
      this.destroy$.next(true);
      // This completes the subject property.
      this.destroy$.complete();
    }
  }

  //#endregion Init and destroy methods ends


  //#region set value from query param starts

  getDataList(sourceInfo: SourceInfo) {
    this.dataStatus = DataStatusEnum.Fetching;
    sourceInfo.gridDataStatus = DataStatusEnum.Fetching;
    this.addDefaultFilters(sourceInfo);
    this.applyFilterBeforeListCalled(sourceInfo);
    this.loadDataFromServerSubscription(sourceInfo);
    this.afterLoadedDataSubscription(sourceInfo);
    this.afterLoadedErrorSubscription(sourceInfo);
    sourceInfo.filterChanged.next('');
  }

  addDefaultFilters(sourceInfo: SourceInfo) {
    // override if needed
  }

  applyFilterBeforeListCalled(sourceInfo: SourceInfo) {
    let { pageNo, size, filter, orderBy } = this._activatedRoute.snapshot.queryParams;
    let queryParams = { pageNo, size, filter, orderBy };

    // set pageNo and size
    if (pageNo && size) {
      sourceInfo.pagination.pageNo = Number(pageNo);
      sourceInfo.pagination.pageSize = Number(size);
      sourceInfo.paginationQuery = ListHelper.getPaginationQuery(sourceInfo);
    }
    else {
      queryParams[ConstString.PageNoStr] = sourceInfo.pagination.pageNo;
      queryParams[ConstString.SizeStr] = sourceInfo.pagination.pageSize;
      sourceInfo.paginationQuery = ListHelper.getPaginationQuery(sourceInfo);
    }

    // set filter string
    if (filter?.trim()) {
      sourceInfo.filterQuery = `&${ConstString.FilterStr}=${filter}`;
      sourceInfo.filters = this.getFilters(filter);
      this.setFilterValuesToModel(sourceInfo);
    }
    else {
      if (sourceInfo.filters?.length) {
        let filterStr = ListHelper.getFilterStrFromFilters(sourceInfo);
        sourceInfo.filterQuery = `&${ConstString.FilterStr}=${filterStr}`;
        queryParams[ConstString.FilterStr] = filterStr;
      }
    }

    // set orderby string
    if (orderBy?.trim()) {
      sourceInfo.sortQuery = `&${ConstString.OrderByStr}=${orderBy}`;
      sourceInfo.sortingState = this.getSortingState(orderBy);
    }
    else {
      if (sourceInfo.sortingState.column.trim() !== '' && sourceInfo.sortingState.order.trim() !== '') {
        let sortingStr = ListHelper.getSortingStrFromSortingState(sourceInfo);
        sourceInfo.sortQuery = `&${ConstString.OrderByStr}=${sortingStr}`;
        queryParams[ConstString.OrderByStr] = sortingStr;
      }
    }

    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: queryParams,
    });
  }

  getFilters(filter: string): FilterModel[] {
    let filters: FilterModel[] = [];
    let totalFieldValueStringArray: FilterStrWithOperatorModel[] = [];
    this.getFieldValueStringArray(filter, totalFieldValueStringArray, '');
    for (let index = 0; index < totalFieldValueStringArray.length; index++) {
      const element = totalFieldValueStringArray[index];
      if (element) {
        let splittedElement = element.filterStr.split(',');
        if (splittedElement?.length > 2) {
          filters.push({ filterName: splittedElement[0], filterVal: splittedElement[2], operator: `,${splittedElement[1]},`, splitOp: element.splitOp });
        }
      }
    }
    return filters;
  }

  getFieldValueStringArray(filter: string, totalFieldValueStringArray: FilterStrWithOperatorModel[] = [], splitOp: string) {
    const andIndex = filter.indexOf(ConstString.AndSplit);
    if (andIndex !== -1) {
      let splittedArray = filter.split(ConstString.AndSplit);
      for (let index = 0; index < splittedArray.length; index++) {
        const element = splittedArray[index];
        this.getFieldValueStringArray(element, totalFieldValueStringArray, ConstString.AndSplit);
      }
    }
    else {
      const orIndex = filter.indexOf(ConstString.OrSplit);
      if (orIndex !== -1) {
        let splittedArray = filter.split(ConstString.OrSplit);
        for (let index = 0; index < splittedArray.length; index++) {
          const element = splittedArray[index];
          this.getFieldValueStringArray(element, totalFieldValueStringArray, ConstString.OrSplit);
        }
      }
      else {
        totalFieldValueStringArray.push({ filterStr: filter, splitOp: splitOp });
      }
    }
  }

  getSortingState(orderBy: string): SortingModel {
    let sortingState: SortingModel = { column: '', order: '' };
    if (orderBy.endsWith(ConstString.SortOrderDesc)) {
      let splittedArray = orderBy.split(ConstString.SortOrderDesc);
      if (splittedArray?.length) {
        sortingState.column = splittedArray[0];
        sortingState.order = ConstString.SortOrderDesc;
      }
    }
    else if (orderBy.endsWith(ConstString.SortOrderAsc)) {
      let splittedArray = orderBy.split(ConstString.SortOrderAsc);
      if (splittedArray?.length) {
        sortingState.column = splittedArray[0];
        sortingState.order = ConstString.SortOrderAsc;
      }
    }
    else {
      // do nothing
    }
    return sortingState;
  }

  setFilterValuesToModel(sourceInfo: SourceInfo) {
    // override if search txt exist
  }

  //#endregion query param related code ends


  //#region load list data starts

  getList(sourceInfo: SourceInfo): Observable<ApiOkResponse<any>> {
    let url = `/${sourceInfo.apiName}${sourceInfo.paginationQuery}${sourceInfo.filterQuery}${sourceInfo.sortQuery}`;
    return (<BaseService<any>>sourceInfo._service).getResponse<any>((<BaseService<any>>sourceInfo._service).baseUrl, url);
  }

  loadDataFromServerSubscription(sourceInfo: SourceInfo) {
    sourceInfo.filterChanged.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.getList(sourceInfo).pipe(map((response: any) => {
          sourceInfo.pagination.totalRecords = response?.data?.totalRecords;
          return response.data.items;
        })).subscribe({
          next: (response: T[]) => {
            sourceInfo.afterLoadedData.next(response);
          },
          error: (error: ApiError) => {
            sourceInfo.afterLoadedError.next(error);
          }
        })
      }
    })
  }

  afterLoadedDataSubscription(sourceInfo: SourceInfo) {
    sourceInfo.afterLoadedData.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: T[]) => {
        this.makeDataAvailable(sourceInfo, data);
      }
    })
  }

  afterLoadedErrorSubscription(sourceInfo: SourceInfo) {
    sourceInfo.afterLoadedError.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ApiError) => {
        this.makeDataAvailable(sourceInfo);
        sourceInfo._service?.showApiErrorToast(data);
      }
    })
  }

  makeDataAvailable(sourceInfo: SourceInfo, data: T[] = []) {
    sourceInfo.list = instanceToInstance<T[]>(data);
    sourceInfo.gridDataStatus = DataStatusEnum.DataAvailable;
    this.selectedRecordList = [];
    this.selectedRecord = undefined;
    this.selectAll = false;
    this.makeFinalDataAvailable();
  }

  makeFinalDataAvailable() {
    this.dataStatus = DataStatusEnum.DataAvailable;
  }

  //#endregion load list data ends


  //#region filter/sorting operation on list starts

  onClearFilter() {
    ListHelper.onClearFilter(this.sourceInfo, true, this._router, this._activatedRoute);
  }

  onClearSorting() {
    ListHelper.onClearSorting(this.sourceInfo, true, this._router, this._activatedRoute);
  }

  onRefresh() {
    ListHelper.onRefresh(this.sourceInfo);
  }

  pageChanged() {
    ListHelper.pageChanged(this.sourceInfo, true, this._router, this._activatedRoute);
  }

  onFilter(key: string, value: string, operator: string = ConstString.ContainsSplit, splitOperatorToBeAddedBefore: string = ConstString.AndSplit) {
    ListHelper.onFilter(this.sourceInfo, key, value, operator, splitOperatorToBeAddedBefore, true, this._router, this._activatedRoute);
  }

  onColumnSort(data: SortingModel) {
    ListHelper.onSorting(this.sourceInfo, true, this._router, this._activatedRoute);
  }

  //#endregion filter/sorting operation on list ends


  //#region open/delete/enable record related functions starts

  gotoDetail(record?: T) {
    if (record) {
      this._router.navigate(['.', record.id], { relativeTo: this._activatedRoute });
    } else {
      this._router.navigate(['.', '0'], { relativeTo: this._activatedRoute });
    }
  }

  onDeleteClick(record: T): void {
    const modalRef = this.sourceInfo._service?.modal.open(ConfirmDialogPopupComponent);
    if (modalRef) {
      const confirmDlg: ConfirmDialogPopupComponent = modalRef.componentInstance;
      this.setDeleteDialogInfo(confirmDlg);
      modalRef.result.then((result) => {
        if (record.id) {
          this.onDeleteRecord(record.id);
        }
      }, (reason) => {
        return false;
      });
    }
  }

  setDeleteDialogInfo(component: ConfirmDialogPopupComponent) {
    component.model.messageTextId = 'DELETE_CONFIRM';
  }

  onDeleteRecord(id: number): void {
    if (this.sourceInfo._service) {
      this.sourceInfo._service.deleteRecord(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: any) => {
            this.sourceInfo._service?.showSuccessIdToast(result.eventMessageId);
            this.onRefresh();
          },
          error: (error: ApiError) => {
            this.sourceInfo._service?.showApiErrorToast(error);
          }
        }
        );
    }
  }

  //#endregion open/delete/enable record related functions ends


  //#region record selection related functions starts

  changeSelection(record: T) {
    record.$selected = !record.$selected;

    // single selection
    if (!this.allowMultipleSelect) {
      // remove pre-selection..
      if (record != this.selectedRecord) {
        if (this.selectedRecord) {
          this.selectedRecord.$selected = false;
        }
      }
      // Update selection.
      if (record.$selected) {
        this.selectedRecord = <T>record;
        // take a reference in array also so one can use this.selectedRecord or list it will work.
        this.selectedRecordList = [];
        this.selectedRecordList[0] = this.selectedRecord;
      } else {
        this.selectedRecord = undefined;
        this.selectedRecordList = [];
      }
    } else {
      // Multi-select case.
      if (this.selectedRecordList) {
        if (record.$selected) {
          // add to selected list only if not added already
          const index = this.selectedRecordList.findIndex(c => c === record);
          if (index < 0) {
            this.selectedRecordList.push(<T>record);
          }
          this.selectedRecord = <T>record;
        } else {
          const index = this.selectedRecordList.indexOf(<T>record);
          if (index >= 0) {
            this.selectedRecordList.splice(index, 1);
            if (this.selectedRecordList.length == 0) {
              this.selectedRecord = undefined;
            } else {
              this.selectedRecord = this.selectedRecordList[0];
            }
          }
        }
        this.selectAll = this.selectedRecordList.length === this.sourceInfo.list.length;
      }
    }
  }

  onSelectDeselectAll() {
    if (this.allowMultipleSelect) {
      this.selectAll = !this.selectAll;
      this.selectedRecordList = [];
      (<T[]>this.sourceInfo.list).forEach(element => {
        (<T>element).$selected = this.selectAll;
        if (this.selectAll) {
          this.selectedRecordList?.push(element);
        }
      });
      if (this.selectAll) {
        this.selectedRecord = this.selectedRecordList[0];
      } else {
        this.selectedRecord = undefined;
      }
    }
  }

  protected clearSelection() {
    this.selectedRecordList = [];
    this.selectAll = false;
    if (this.sourceInfo.list) {
      (<T[]>this.sourceInfo.list).forEach(element => {
        (<IBaseList>element).$selected = false;
      });
    }
  }

  //#endregion record selection related functions ends


  // TODO: need to be checked following region
  //#region rights related functions starts

  public get isOpenAllowed(): boolean {
    if (!this.allowMultipleSelect && this.selectedRecord) {
      return this.isViewAccess;
    } else if (this.allowMultipleSelect && this.selectedRecordList?.length === 1) {
      return this.isViewAccess;
    } else {
      return false;
    }
  }

  public get isDeleteAllowed(): boolean {
    if (!this.allowMultipleSelect && this.selectedRecord) {
      return this.isDeleteAccess;
    } else if (this.allowMultipleSelect && this.selectedRecordList?.length) {
      return this.isDeleteAccess;
    } else {
      return false;
    }
  }

  public get isCreateAccess(): boolean {
    return this.evaluatedPermission.createAccess;
  }

  public get isUpdateAccess(): boolean {
    return this.evaluatedPermission.updateAccess;
  }

  public get isViewAccess(): boolean {
    return this.evaluatedPermission.viewAccess;
  }

  public get isDeleteAccess(): boolean {
    return this.evaluatedPermission.deleteAccess;
  }

  //#endregion rights related functions ends
}