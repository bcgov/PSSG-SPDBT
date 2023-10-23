/* tslint:disable */
/* eslint-disable */
import { DocumentTypeCode } from './document-type-code';
export interface Documents {
  attachments?: null | Array<Blob>;
  documentTypeCode?: DocumentTypeCode;
  expiredDate?: null | string;
}
