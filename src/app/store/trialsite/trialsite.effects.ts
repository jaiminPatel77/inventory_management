import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TrialSiteService } from "../../modules/temp-examples/services/trial-site.service";
import { createTrialSite, createTrialSiteFailure, createTrialSiteSuccess, deleteTrialSite, deleteTrialSiteFailure, deleteTrialSiteSuccess, getTrialSites, getTrialSitesFailure, getTrialSitesSuccess, updateTrialSite, updateTrialSiteFailure, updateTrialSiteSuccess } from "./trialsite.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { TrialSiteDto, TrialSiteListDto } from "../../modules/temp-examples/models/trial-site-dto";

@Injectable()
export class TrialSiteEffects {

    constructor(private action$: Actions, private service: TrialSiteService) {

    }

    getTrialSites$ = createEffect(() =>
        this.action$.pipe(
            ofType(getTrialSites),
            switchMap(() => {
                return this.service.getTrialSiteList().pipe(
                    map((data) => getTrialSitesSuccess({ list: <TrialSiteListDto[]>(data) })),
                    catchError((error) => of(getTrialSitesFailure({ errorMessage: error })))
                )
            }
            )
        )
    );

    createTrialSite$ = createEffect(() =>
        this.action$.pipe(
            ofType(createTrialSite),
            switchMap(({ trialSite }) => {
                return this.service.updateRecord(trialSite.id, trialSite).pipe(
                    map((data) => createTrialSiteSuccess({ trialSite: <TrialSiteDto>data.data })),
                    catchError((error) => of(createTrialSiteFailure({ errorMessage: error })))
                )
            }
            )
        )
    );

    updateTrialSite$ = createEffect(() =>
        this.action$.pipe(
            ofType(updateTrialSite),
            switchMap(({ trialSite }) => {
                return this.service.updateRecord(trialSite.id, trialSite).pipe(
                    map((data) => updateTrialSiteSuccess({ trialSite: <TrialSiteDto>data.data })),
                    catchError((error) => of(updateTrialSiteFailure({ errorMessage: error })))
                )
            }
            )
        )
    );

    deleteTrialSite$ = createEffect(() =>
        this.action$.pipe(
            ofType(deleteTrialSite),
            switchMap(({ trialSite }) => {
                return this.service.deleteRecord(trialSite.id || 0).pipe(
                    map((data) => deleteTrialSiteSuccess({ trialSite: <TrialSiteDto>data.data })),
                    catchError((error) => of(deleteTrialSiteFailure({ errorMessage: error })))
                )
            }
            )
        )
    );

}