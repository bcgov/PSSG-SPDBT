import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationService, LicenceModel, LicenceModelSubject } from '../licence-application.service';

@Component({
	selector: 'app-summary-review',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>
				<div class="step-container">
					<div class="row" *ngIf="licenceModel">
						<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row">
								<div class="col-12">
									<mat-accordion multi="true">
										<mat-expansion-panel [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title>
													<div class="fs-5 fw-semibold my-2">Licence Selection</div>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<div class="text-minor-heading mb-3">Licence Information</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence type</div>
														<div class="text-data">
															{{ licenceModel.licenceTypeCode | options : 'SwlTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Application type</div>
														<div class="text-data">
															{{ licenceModel.applicationTypeCode | options : 'SwlApplicationTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Sole Proprietorship Security Business Licence
														</div>
														<div class="text-data">{{ licenceModel.isSoleProprietor }}</div>
													</div>
												</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Category</div>
														<div class="text-data">
															<div *ngFor="let item of licenceModel.swlCategoryList; let i = index">
																{{ item.desc }}
															</div>
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
														<div class="text-data">{{ licenceModel.licenceTermCode | options : 'SwlTermTypes' }}</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
														<div class="text-data">??</div>
													</div>
												</div>
												<div class="row mt-0 mt-lg-2" *ngIf="licenceModel.hasExpiredLicence == booleanTypeCodes.Yes">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Number</div>
														<div class="text-data">{{ licenceModel.expiredLicenceNumber | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Expiry Date</div>
														<div class="text-data">
															{{ licenceModel.expiryDate | date : constants.date.dateFormat | default }}
														</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading mb-3">Documents Uploaded</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Document</div>
														<div class="text-data">xBasic Security Training Certificate</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Document Expiry Date</div>
														<div class="text-data">x2026-09-23</div>
													</div>
												</div>
												<ng-container *ngIf="licenceModel.hasExpiredLicence == booleanTypeCodes.Yes">
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Dog & Restraints Authorization</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to Use Restraints?</div>
															<div class="text-data">{{ licenceModel.carryAndUseRetraints }}</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ licenceModel.carryAndUseRetraintsDocument | options : 'RestraintDocumentTypes' }}
															</div>
															<div class="text-data">???</div>
														</div>
													</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to Use Dogs?</div>
															<div class="text-data">{{ licenceModel.useDogsOrRestraints }}</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Reason</div>
															<div class="text-data">
																<div *ngIf="licenceModel.isDogsPurposeProtection">Protection</div>
																<div *ngIf="licenceModel.isDogsPurposeDetectionDrugs">Detection - Drugs</div>
																<div *ngIf="licenceModel.isDogsPurposeDetectionExplosives">Detection - Explosives</div>
															</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ licenceModel.dogsPurposeDocumentType | options : 'DogDocumentTypes' }}
															</div>
															<div class="text-data">???</div>
														</div>
													</div>
												</ng-container>
											</div>
										</mat-expansion-panel>

										<mat-expansion-panel [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title>
													<div class="fs-5 fw-semibold my-2">Background Information</div>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<div class="text-minor-heading">Police Background</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Police Officer or Peace Officer Roles
														</div>
														<div class="text-data">xYes</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
														<div class="text-data">xSheriff/Deputy Sheriff</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
														<div class="text-data">xpdf</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading">Mental Health Conditions</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Conditions?</div>
														<div class="text-data">xYes</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
														<div class="text-data">xpdf</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading">Criminal History</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Do you have a criminal record?</div>
														<div class="text-data">xYes</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading">Fingerprints</div>
												<div class="row mt-0 mt-lg-2">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Have you had your fingerprints taken?
														</div>
														<div class="text-data">xYes</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Request for Fingerprinting Form
														</div>
														<div class="text-data">xpdf</div>
													</div>
												</div>
											</div>
										</mat-expansion-panel>

										<mat-expansion-panel [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title>
													<div class="fs-5 fw-semibold my-2">Identification</div>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<p>This is the primary content of the panel.</p>
											</div>
										</mat-expansion-panel>
									</mat-accordion>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.title {
				margin-top: 20px;
				margin-bottom: 10px;
			}
			.mat-expansion-panel {
				border-radius: 0;
			}
			.mat-expansion-panel-header {
				height: unset;
			}

			.panel-body {
				margin-top: 10px;
				margin-bottom: 10px;
			}

			.text-data {
				font-size: 1.05rem;
				font-weight: 400;
				line-height: 1.3em;
			}

			.text-label {
				font-size: smaller;
			}
		`,
	],
})
export class SummaryReviewComponent implements OnInit, OnDestroy {
	private licenceModelLoadedSubscription!: Subscription;

	licenceModel: LicenceModel | null = null;
	constants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				console.log('SummaryReviewComponent', loaded);
				if (loaded.isLoaded) {
					this.licenceModel = this.licenceApplicationService.licenceModel;
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}
}
