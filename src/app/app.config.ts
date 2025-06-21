import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PreloadingStrategyService } from './services/preloading-strategy.service';
import { httpInterceptors } from './models/application-configurations/http-interceptor';
import { translateModule } from './models/application-configurations/ngx-translate-config';
import { toasterModule } from './models/application-configurations/ngx-toastr-config';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { TrialSiteEffects } from './store/trialsite/trialsite.effects';
import { TrialSiteReducer } from './store/trialsite/trialsite.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    httpInterceptors,
    provideRouter(routes, withPreloading(PreloadingStrategyService)),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(translateModule),
    toasterModule,
    provideAnimations(),
    provideStore({ 'trialSite': TrialSiteReducer }),
    provideEffects([TrialSiteEffects])
  ]
};
