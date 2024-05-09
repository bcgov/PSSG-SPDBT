/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AddressAutoCompleteService } from './services/address-auto-complete.service';
import { ApplicantLicenceAppService } from './services/applicant-licence-app.service';
import { ApplicantProfileService } from './services/applicant-profile.service';
import { BizLicensingService } from './services/biz-licensing.service';
import { BizProfileService } from './services/biz-profile.service';
import { ConfigurationService } from './services/configuration.service';
import { LicenceService } from './services/licence.service';
import { LicenceFeeService } from './services/licence-fee.service';
import { LoginService } from './services/login.service';
import { PaymentService } from './services/payment.service';
import { PermitService } from './services/permit.service';
import { SecurityWorkerLicensingService } from './services/security-worker-licensing.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AddressAutoCompleteService,
    ApplicantLicenceAppService,
    ApplicantProfileService,
    BizLicensingService,
    BizProfileService,
    ConfigurationService,
    LicenceService,
    LicenceFeeService,
    LoginService,
    PaymentService,
    PermitService,
    SecurityWorkerLicensingService,
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
