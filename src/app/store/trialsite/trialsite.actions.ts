import { createAction, props } from "@ngrx/store"
import { TrialSiteDto } from "../../modules/temp-examples/models/trial-site-dto"

const prefix = '[trialsites]';
export const get_trialSites = `${prefix} get trialsites`
export const get_trialSites_success = `${get_trialSites} success`
export const get_trialSites_failure = `${get_trialSites} failure`
export const create_trialSite = `${prefix} create trialsite`
export const create_trialSite_success = `${create_trialSite} success`
export const create_trialSite_failure = `${create_trialSite} failure`
export const update_trialSite = `${prefix} update trialsite`
export const update_trialSite_success = `${update_trialSite} success`
export const update_trialSite_failure = `${update_trialSite} failure`
export const delete_trialSite = `${prefix} delete trialsite`
export const delete_trialSite_success = `${delete_trialSite} success`
export const delete_trialSite_failure = `${delete_trialSite} failure`

// get trial sites
export const getTrialSites = createAction(get_trialSites)
export const getTrialSitesSuccess = createAction(
    get_trialSites_success,
    props<{
        list: TrialSiteDto[];
    }>()
)
export const getTrialSitesFailure = createAction(
    get_trialSites_failure,
    props<{
        errorMessage: any;
    }>()
)

// create trial site
export const createTrialSite = createAction(
    create_trialSite,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const createTrialSiteSuccess = createAction(
    create_trialSite_success,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const createTrialSiteFailure = createAction(
    create_trialSite_failure,
    props<{
        errorMessage: any;
    }>()
)

// update trial site
export const updateTrialSite = createAction(
    update_trialSite,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const updateTrialSiteSuccess = createAction(
    update_trialSite_success,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const updateTrialSiteFailure = createAction(
    update_trialSite_failure,
    props<{
        errorMessage: any;
    }>()
)

// delete trial site
export const deleteTrialSite = createAction(
    delete_trialSite,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const deleteTrialSiteSuccess = createAction(
    delete_trialSite_success,
    props<{
        trialSite: Partial<TrialSiteDto>;
    }>()
)
export const deleteTrialSiteFailure = createAction(
    delete_trialSite_failure,
    props<{
        errorMessage: any;
    }>()
)

