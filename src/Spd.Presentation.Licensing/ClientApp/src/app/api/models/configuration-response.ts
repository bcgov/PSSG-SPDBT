/* tslint:disable */
/* eslint-disable */
import { BcscConfiguration } from './bcsc-configuration';
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
export interface ConfigurationResponse {
  bcscConfiguration?: BcscConfiguration;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
