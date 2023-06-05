/* tslint:disable */
/* eslint-disable */
import { BcscConfiguration } from './bcsc-configuration';
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
export interface ConfigurationResponse {
  bannerMessage?: null | string;
  bcscConfiguration?: BcscConfiguration;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
