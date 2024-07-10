/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from '../models/oidc-configuration';
import { RecaptchaConfiguration } from '../models/recaptcha-configuration';
export interface ConfigurationResponse {
  bannerMessage?: string | null;
  bceidConfiguration?: OidcConfiguration;
  bcscConfiguration?: OidcConfiguration;
  environment?: string | null;
  idirConfiguration?: OidcConfiguration;
  payBcSearchInvoiceUrl?: string | null;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
