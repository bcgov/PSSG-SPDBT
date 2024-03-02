/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
export interface ConfigurationResponse {
  bannerMessage?: null | string;
  bceidConfiguration?: OidcConfiguration;
  bcscConfiguration?: OidcConfiguration;
  idirConfiguration?: OidcConfiguration;
  payBcSearchInvoiceUrl?: null | string;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
