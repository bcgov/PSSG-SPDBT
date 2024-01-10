/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AddressAutoCompleteService } from './services/address-auto-complete.service';
import { ConfigurationService } from './services/configuration.service';
import { LicenceFeeService } from './services/licence-fee.service';
import { LicenceLookupService } from './services/licence-lookup.service';
import { PaymentService } from './services/payment.service';
import { UserProfileService } from './services/user-profile.service';
import { WorkerLicensingService } from './services/worker-licensing.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    AddressAutoCompleteService,
    ConfigurationService,
    LicenceFeeService,
    LicenceLookupService,
    PaymentService,
    UserProfileService,
    WorkerLicensingService,
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
