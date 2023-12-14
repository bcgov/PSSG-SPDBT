/* tslint:disable */
/* eslint-disable */
import { BcscConfiguration } from './bcsc-configuration';
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
export interface ConfigurationResponse {
  bcscConfiguration?: BcscConfiguration;
  invalidWorkerLicenceCategoryMatrixConfiguration?: null | {
[key: string]: Array<WorkerCategoryTypeCode>;
};
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
