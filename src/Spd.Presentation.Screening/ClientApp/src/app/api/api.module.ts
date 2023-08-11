/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AddressAutoCompleteService } from './services/address-auto-complete.service';
import { ApplicantService } from './services/applicant.service';
import { ApplicationService } from './services/application.service';
import { ConfigurationService } from './services/configuration.service';
import { MinistryService } from './services/ministry.service';
import { OrgService } from './services/org.service';
import { OrgRegistrationService } from './services/org-registration.service';
import { OrgReportService } from './services/org-report.service';
import { OrgUserService } from './services/org-user.service';
import { PaymentService } from './services/payment.service';
import { UserProfileService } from './services/user-profile.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AddressAutoCompleteService,
    ApplicantService,
    ApplicationService,
    ConfigurationService,
    MinistryService,
    OrgService,
    OrgRegistrationService,
    OrgReportService,
    OrgUserService,
    PaymentService,
    UserProfileService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
