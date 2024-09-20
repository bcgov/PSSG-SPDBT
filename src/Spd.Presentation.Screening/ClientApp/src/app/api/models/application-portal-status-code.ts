/* tslint:disable */
/* eslint-disable */
export enum ApplicationPortalStatusCode {
  Draft = 'Draft',
  VerifyIdentity = 'VerifyIdentity',
  InProgress = 'InProgress',
  AwaitingPayment = 'AwaitingPayment',
  AwaitingThirdParty = 'AwaitingThirdParty',
  AwaitingApplicant = 'AwaitingApplicant',
  UnderAssessment = 'UnderAssessment',
  Incomplete = 'Incomplete',
  CompletedCleared = 'CompletedCleared',
  RiskFound = 'RiskFound',
  ClosedNoResponse = 'ClosedNoResponse',
  ClosedNoConsent = 'ClosedNoConsent',
  CancelledByApplicant = 'CancelledByApplicant',
  CancelledByOrganization = 'CancelledByOrganization',
  RefundRequested = 'RefundRequested',
  Completed = 'Completed'
}
