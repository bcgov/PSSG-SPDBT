import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-summary-review',
	template: `
		<div class="step">
			<app-step-title
				title="Application Summary"
				subtitle="Review your information before submitting your application"
			></app-step-title>
			<div class="step-container">
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-12">
									<mat-accordion multi="false">
										<mat-expansion-panel [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title>
													<span class="title">Licence Selection</span>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="row mb-2">
												<div class="col-12 mx-auto">
													<mat-divider class="my-2"></mat-divider>
													<div class="text-minor-heading fw-semibold">Licence Information</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence type</div>
															<div class="text-data">Security Worker Licence</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Application type</div>
															<div class="text-data">New</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Sole Proprietorship Security Business Licence
															</div>
															<div class="text-data">Yes</div>
														</div>
													</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Category</div>
															<div class="text-data">Security Guard</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
															<div class="text-data">2 years</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
															<div class="text-data">$180</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading fw-semibold">Expired Licence</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Number</div>
															<div class="text-data">1234567</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Term</div>
															<div class="text-data">2 years</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Expiry Date</div>
															<div class="text-data">2010-04-05</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading fw-semibold">Documents Uploaded</div>
													<div class="row mt-0 mt-lg-2">
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Document</div>
															<div class="text-data">Basic Security Training Certificate</div>
														</div>
														<div class="col-lg-4 col-md-12">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Document Expiry Date</div>
															<div class="text-data">2026-09-23</div>
														</div>
													</div>
												</div>
											</div>
										</mat-expansion-panel>
										<mat-expansion-panel>
											<mat-expansion-panel-header>
												<mat-panel-title>
													<span class="title">Background Information</span>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<mat-divider class="mt-4 mb-2"></mat-divider>
											<div class="text-minor-heading fw-semibold">Police Background</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">
														Police Officer or Peace Officer Roles
													</div>
													<div class="text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
													<div class="text-data">Sheriff/Deputy Sheriff</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
													<div class="text-data">pdf</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>
											<div class="text-minor-heading fw-semibold">Dog & Restraints Authorization</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to Use Dogs?</div>
													<div class="text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Reason</div>
													<div class="text-data">Detection - Drugs, Detection - Explosives</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Validation Certificate</div>
													<div class="text-data">pdf</div>
												</div>
											</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to Use Restraints?</div>
													<div class="text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">
														Certificate of Advanced Security Training
													</div>
													<div class="text-data">pdf</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>
											<div class="text-minor-heading fw-semibold">Mental Health Conditions</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Conditions?</div>
													<div class="text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
													<div class="text-data">pdf</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>
											<div class="text-minor-heading fw-semibold">Criminal History</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Do you have a criminal record?</div>
													<div class="text-data">Yes</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>
											<div class="text-minor-heading fw-semibold">Fingerprints</div>
											<div class="row mt-0 mt-lg-2">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">
														Have you had your fingerprints taken?
													</div>
													<div class="text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Request for Fingerprinting Form</div>
													<div class="text-data">pdf</div>
												</div>
											</div>
										</mat-expansion-panel>
										<mat-expansion-panel>
											<mat-expansion-panel-header>
												<mat-panel-title>
													<span class="title">Identification</span>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<p>This is the primary content of the panel.</p>
										</mat-expansion-panel>
									</mat-accordion>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
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
		`,
	],
})
export class SummaryReviewComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
