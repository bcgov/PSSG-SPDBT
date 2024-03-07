/* tslint:disable */
/* eslint-disable */
import { LicenceFeeResponse } from './licence-fee-response';
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
export interface ConfigurationResponse {
  bcscConfiguration?: OidcConfiguration;
  invalidWorkerLicenceCategoryMatrixConfiguration?: null | {
[key: string]: Array<WorkerCategoryTypeCode>;
};
  licenceFees?: null | Array<LicenceFeeResponse>;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
