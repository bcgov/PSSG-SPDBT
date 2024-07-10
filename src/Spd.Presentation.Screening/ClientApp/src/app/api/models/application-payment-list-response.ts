/* tslint:disable */
/* eslint-disable */
import { ApplicationPaymentResponse } from '../models/application-payment-response';
import { PaginationResponse } from '../models/pagination-response';
export interface ApplicationPaymentListResponse {
  applications?: Array<ApplicationPaymentResponse> | null;
  pagination?: PaginationResponse;
}
