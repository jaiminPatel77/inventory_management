import { ActivatedRoute, Params, Router } from "@angular/router";
import { FilterModel, SourceInfo } from "./table-conf";
import { DataStatusEnum } from "./common-models";
import { ConstString } from "./const-string";

export class ListHelper {

    //#region filter/sorting operation on list starts

    static onClearFilter(sourceInfo: SourceInfo, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        sourceInfo.filters = [];
        sourceInfo.filterQuery = '';
        if (needToUpdateActivateRoute) {
            const queryParams: Params = { filter: undefined };
            _router?.navigate(
                [],
                {
                    relativeTo: _activatedRoute,
                    queryParams,
                    queryParamsHandling: 'merge',
                }
            );
        }
        this.onRefresh(sourceInfo);
    }

    static onClearSorting(sourceInfo: SourceInfo, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        sourceInfo.sortingState = { column: '', order: '' };
        sourceInfo.sortQuery = '';
        if (needToUpdateActivateRoute) {
            const queryParams: Params = { orderBy: undefined };
            _router?.navigate(
                [],
                {
                    relativeTo: _activatedRoute,
                    queryParams,
                    queryParamsHandling: 'merge',
                }
            );
        }
        this.onRefresh(sourceInfo);
    }

    static onRefresh(sourceInfo: SourceInfo) {
        sourceInfo.gridDataStatus = DataStatusEnum.Fetching;
        sourceInfo.filterChanged.next('');
    }

    static pageChanged(sourceInfo: SourceInfo, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        this.updatePaginationQuery(sourceInfo);
        if (needToUpdateActivateRoute) {
            const queryParams: Params = { pageNo: sourceInfo.pagination.pageNo };
            _router?.navigate(
                [],
                {
                    relativeTo: _activatedRoute,
                    queryParams,
                    queryParamsHandling: 'merge',
                }
            );
        }
        this.onRefresh(sourceInfo);
    }

    static updatePaginationQuery(sourceInfo: SourceInfo) {
        sourceInfo.paginationQuery = ListHelper.getPaginationQuery(sourceInfo);
    }

    static getPaginationQuery(sourceInfo: SourceInfo): string {
        return `?${ConstString.PageNoStr}=${sourceInfo.pagination.pageNo}&${ConstString.SizeStr}=${sourceInfo.pagination.pageSize}`;
    }

    static onFilter(sourceInfo: SourceInfo, key: string, value: string, operator: string = ConstString.ContainsSplit, splitOperatorToBeAddedBefore: string = ConstString.AndSplit, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        let findFilter = sourceInfo.filters.find((obj: FilterModel) => obj.filterName === key);
        if (findFilter) {
            findFilter.filterVal = value;
        }
        else {
            if (sourceInfo.filters?.length) {
                sourceInfo.filters[sourceInfo.filters.length - 1].splitOp = splitOperatorToBeAddedBefore;
            }
            sourceInfo.filters.push({ filterName: key, filterVal: value, operator: operator, splitOp: '' });
        }
        ListHelper.removeEmptyValueFromFilterQuery(sourceInfo, needToUpdateActivateRoute, _router, _activatedRoute);
        this.onRefresh(sourceInfo);
    }

    static removeEmptyValueFromFilterQuery(sourceInfo: SourceInfo, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        sourceInfo.filters = sourceInfo.filters.filter(e => e.filterVal && e.filterVal.trim() !== '');
        let filterStr: string | undefined = undefined;
        if (sourceInfo.filters?.length) {
            sourceInfo.filters[sourceInfo.filters?.length - 1].splitOp = '';
            filterStr = ListHelper.getFilterStrFromFilters(sourceInfo);
            sourceInfo.filterQuery = `&${ConstString.FilterStr}=${filterStr}`;
        }
        else {
            sourceInfo.filterQuery = '';
        }

        if (needToUpdateActivateRoute) {
            const queryParams: Params = { filter: filterStr };
            _router?.navigate(
                [],
                {
                    relativeTo: _activatedRoute,
                    queryParams,
                    queryParamsHandling: 'merge',
                }
            );
        }
    }

    static getFilterStrFromFilters(sourceInfo: SourceInfo): string {
        let filterStr: string = '';
        for (let index = 0; index < sourceInfo.filters.length; index++) {
            const element = sourceInfo.filters[index];

            if (index === sourceInfo.filters.length - 1) {
                element.splitOp = '';
            }

            if (index === 0) {
                filterStr = element.filterName + element.operator + element.filterVal + element.splitOp;
            }
            else {
                filterStr = filterStr + element.filterName + element.operator + element.filterVal + element.splitOp;
            }
        }
        return filterStr;
    }

    static onSorting(sourceInfo: SourceInfo, needToUpdateActivateRoute: boolean = true, _router?: Router, _activatedRoute?: ActivatedRoute) {
        let sortingStr: string | undefined = undefined;
        if (sourceInfo.sortingState.column.trim() !== '' && sourceInfo.sortingState.order.trim() !== '') {
            sortingStr = this.getSortingStrFromSortingState(sourceInfo);
            sourceInfo.sortQuery = `&${ConstString.OrderByStr}=${sortingStr}`;
        }
        else {
            sourceInfo.sortQuery = '';
        }

        if (needToUpdateActivateRoute) {
            const queryParams: Params = { orderBy: sortingStr };
            _router?.navigate(
                [],
                {
                    relativeTo: _activatedRoute,
                    queryParams,
                    queryParamsHandling: 'merge',
                }
            );
        }
        this.onRefresh(sourceInfo);
    }

    static getSortingStrFromSortingState(sourceInfo: SourceInfo): string {
        let sortingStr: string = '';
        sortingStr = `${sourceInfo.sortingState.column}${sourceInfo.sortingState.order}`;
        return sortingStr;
    }

    //#endregion filter/sorting operation on list ends

}