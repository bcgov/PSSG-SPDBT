/* tslint:disable */
/* eslint-disable */
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
export interface ConfigurationResponse {
  bannerMessage?: null | string;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
}
