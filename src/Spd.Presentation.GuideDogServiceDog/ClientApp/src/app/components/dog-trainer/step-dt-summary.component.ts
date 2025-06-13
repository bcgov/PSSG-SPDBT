import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-summary',
	template: `
		<app-step-section
			heading="Registration summary"
			subheading="Review your information before submitting your application."
			*ngIf="dogTrainerModelData"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Training School Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step"
											aria-label="Go to Step"
											(click)="onEditStep($event, 1)"
											(keydown.enter)="onEditStep($event, 1)"
											(keydown.space)="onEditStep($event, 1)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Training School Name</div>
										<div class="summary-text-data">{{ accreditedSchoolName }}</div>
									</div>
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Chief Executive Officer/Executive Director</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">CEO/Executive Director Name</div>
										<div class="summary-text-data">{{ schoolDirectorName }}</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ schoolContactPhoneNumber | formatPhoneNumber | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ schoolContactEmailAddress | default }}</div>
									</div>
								</div>
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Dog Trainer Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step"
											aria-label="Go to Step"
											(click)="onEditStep($event, 2)"
											(keydown.enter)="onEditStep($event, 2)"
											(keydown.space)="onEditStep($event, 2)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<div class="text-minor-heading-small mt-2">Dog Trainer</div>
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Dog Trainer Name</div>
										<div class="summary-text-data">{{ trainerName }}</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ trainerDateOfBirth | formatDate | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ trainerPhoneNumber | formatPhoneNumber | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ trainerEmailAddress | default }}</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<app-form-address-summary
									[formData]="dogTrainerModelData.trainerMailingAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<ng-container *ngIf="photoOfYourselfAttachments">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Photo of Yourself</div>
									<div class="row mt-0">
										<div class="col-lg-6 col-md-12">
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</div>
								</ng-container>

								<mat-divider class="mt-3 mb-2"></mat-divider>

								<div class="text-minor-heading-small">
									{{ governmentIssuedPhotoTypeCode | options: 'GovernmentIssuedPhotoIdTypes' }}
								</div>
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let doc of governmentIssuedPhotoAttachments; let i = index">
													<li>{{ doc.name }}</li>
												</ng-container>
											</ul>
										</div>
									</div>
								</div>
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
export class StepDtSummaryComponent implements OnInit, LicenceChildStepperStepComponent {
	dogTrainerModelData: any = {};

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.dogTrainerModelData = {
			...this.dogTrainerApplicationService.dogTrainerModelFormGroup.getRawValue(),
		};
	}

	onEditStep(event: any, stepNumber: number) {
		event.stopPropagation();
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.dogTrainerModelData = {
			...this.dogTrainerApplicationService.dogTrainerModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	get accreditedSchoolName(): string {
		return this.dogTrainerApplicationService.getSummaryaccreditedSchoolName(this.dogTrainerModelData);
	}
	get schoolDirectorName(): string {
		return this.dogTrainerApplicationService.getSummaryschoolDirectorName(this.dogTrainerModelData);
	}
	get schoolContactEmailAddress(): string {
		return this.dogTrainerApplicationService.getSummaryschoolContactEmailAddress(this.dogTrainerModelData);
	}
	get schoolContactPhoneNumber(): string {
		return this.dogTrainerApplicationService.getSummaryschoolContactPhoneNumber(this.dogTrainerModelData);
	}

	get trainerName(): string {
		return this.dogTrainerApplicationService.getSummarytrainerName(this.dogTrainerModelData);
	}
	get trainerDateOfBirth(): string {
		return this.dogTrainerApplicationService.getSummarytrainerdateOfBirth(this.dogTrainerModelData);
	}
	get trainerEmailAddress(): string {
		return this.dogTrainerApplicationService.getSummarytraineremailAddress(this.dogTrainerModelData);
	}
	get trainerPhoneNumber(): string {
		return this.dogTrainerApplicationService.getSummarytrainerphoneNumber(this.dogTrainerModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.dogTrainerApplicationService.getSummaryphotoOfYourselfAttachments(this.dogTrainerModelData);
	}

	get governmentIssuedPhotoTypeCode(): LicenceDocumentTypeCode | null {
		return this.dogTrainerApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.dogTrainerModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.dogTrainerApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.dogTrainerModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] | null {
		return this.dogTrainerApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.dogTrainerModelData);
	}
}
