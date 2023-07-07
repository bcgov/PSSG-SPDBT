/* tslint:disable */
/* eslint-disable */
import { ApplicationPaymentResponse } from './application-payment-response';
import { PaginationResponse } from './pagination-response';
export interface ApplicationPaymentListResponse {
  applications?: null | Array<ApplicationPaymentResponse>;
  pagination?: PaginationResponse;
}
