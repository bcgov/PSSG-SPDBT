import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-summary',
	template: `
		<app-step-section
			title="Registration Summary"
			subtitle="Review your information before submitting your application"
			*ngIf="gdsdModelData"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Cerificate Selection</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 1"
											aria-label="Go to Step 1"
											(click)="$event.stopPropagation(); onEditStep(0)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<!-- <div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Registration Type</div>
										<div class="summary-text-data">Abc</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Registration Number</div>
										<div class="summary-text-data">Def</div>
									</div>
								</div> -->
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Personal Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 2"
											aria-label="Go to Step 2"
											(click)="$event.stopPropagation(); onEditStep(1)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<!-- <div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Business Owner Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Legal Business Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatalegalBusinessName | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Trade or 'Doing Business As' Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatatradeName | default }}
										</div>
									</div>
									<div class="col-12">
										<div class="text-label d-block text-muted">Business Licence Documents</div>
										<ng-container *ngIf="attachmentsExist; else noAttachments">
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of businessLicenceAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</ng-container>
										<ng-template #noAttachments>
											<div class="summary-text-data">There are no business licence documents</div>
										</ng-template>
									</div>
								</div> -->
								<app-form-address-summary
									[formData]="gdsdModelData.mailingAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Dog Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 3"
											aria-label="Go to Step 3"
											(click)="$event.stopPropagation(); onEditStep(2)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<!-- <div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Business Manager Name</div>
										<div class="summary-text-data">
											{{ businessManagerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ businessManagerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">
											{{ businessManagerDataname | default }}
										</div>
									</div>
								</div> -->
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Training Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 4"
											aria-label="Go to Step 4"
											(click)="$event.stopPropagation(); onEditStep(3)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<!-- <app-form-address-summary
									[formData]="gdsdModelData.mailingAddressData"
									headingLabel="Business Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="gdsdModelData.businessMailingAddressData"
									headingLabel="Business Mailing Address"
									[isAddressTheSame]="isAddressTheSame"
									isAddressTheSameLabel="The business address and mailing address are the same"
								></app-form-address-summary> -->
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
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

			.review-panel-title {
				width: 100%;

				.mat-toolbar {
					background-color: var(--color-primary-lighter) !important;
					color: var(--color-primary-dark) !important;
					padding: 0;

					.panel-header {
						white-space: normal;
						margin-top: 0.5rem !important;
						margin-bottom: 0.5rem !important;
					}
				}
			}

			.go-to-step-button {
				width: 35px;
				height: 35px;
			}
		`,
	],
	standalone: false,
})
export class StepGdsdSummaryComponent implements OnInit, LicenceChildStepperStepComponent {
	gdsdModelData: any = {};

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	ngOnInit(): void {
		this.gdsdModelData = {
			...this.gdsdApplicationService.gdsdModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.gdsdModelData = {
			...this.gdsdApplicationService.gdsdModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	// get businessOwnerDataname(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessOwnerDataname(this.gdsdModelData);
	// }
	// get businessOwnerDatalegalBusinessName(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessOwnerDatalegalBusinessName(this.gdsdModelData);
	// }
	// get businessOwnerDatatradeName(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessOwnerDatatradeName(this.gdsdModelData);
	// }

	// get businessManagerDataname(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessManagerDataname(this.gdsdModelData);
	// }
	// get businessManagerDataphoneNumber(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessManagerDataphoneNumber(this.gdsdModelData);
	// }
	// get businessManagerDataemailAddress(): string {
	// 	return this.gdsdApplicationService.getSummarybusinessManagerDataemailAddress(this.gdsdModelData);
	// }

	// get isAddressTheSame(): boolean {
	// 	return this.gdsdApplicationService.getSummaryisAddressTheSame(this.gdsdModelData);
	// }

	// get businessLicenceAttachments(): File[] {
	// 	return this.gdsdApplicationService.getSummarybusinessOwnerDataattachments(this.gdsdModelData);
	// }

	// get branchesArray(): Array<any> {
	// 	return this.gdsdApplicationService.getSummarybranchesDatabranches(this.gdsdModelData);
	// }
}
