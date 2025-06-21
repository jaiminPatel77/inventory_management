import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ITrialSiteModel } from "../../modules/temp-examples/models/trial-site-dto";

const getTrialSiteState = createFeatureSelector<ITrialSiteModel>('trialSite');

export const getTrialSiteList = createSelector(getTrialSiteState, (state) => {
    return state.list;
})
export const getTrialSiteDataStatus = createSelector(getTrialSiteState, (state) => {
    return state.dataStatus;
})
export const getTrialSiteErrorMessage = createSelector(getTrialSiteState, (state) => {
    return state.errorMessage;
})