import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-summary',
	template: `
		<app-step-section
			title="Registration summary"
			subtitle="Review your information before submitting your application."
			*ngIf="retiredDogModelData"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Personal Information</div>
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
								<!-- <div class="text-minor-heading-small mt-2">Training School Information</div>
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Training School Name</div>
										<div class="summary-text-data">{{ accreditedSchoolName }}</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">CEO/Executive Director Name</div>
										<div class="summary-text-data">{{ schoolDirectorName }}</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ schoolDirectorPhoneNumber | formatPhoneNumber }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ schoolDirectorEmailAddress | default }}</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<app-form-address-summary
									[formData]="retiredDogModelData.trainingSchoolAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="false"
								></app-form-address-summary> -->
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
								<!-- <div class="text-minor-heading-small mt-2">Dog Trainer Information</div>
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
											{{ trainerPhoneNumber | formatPhoneNumber }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ trainerEmailAddress | default }}</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<app-form-address-summary
									[formData]="retiredDogModelData.dogTrainerAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

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
								</div> -->
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
export class StepRdSummaryComponent implements OnInit, LicenceChildStepperStepComponent {
	retiredDogModelData: any = {};

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	ngOnInit(): void {
		this.retiredDogModelData = {
			...this.retiredDogApplicationService.retiredDogModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.retiredDogModelData = {
			...this.retiredDogApplicationService.retiredDogModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	// get accreditedSchoolName(): string {
	// 	return this.retiredDogApplicationService.getSummaryaccreditedSchoolName(this.retiredDogModelData);
	// }
	// get schoolDirectorName(): string {
	// 	return this.retiredDogApplicationService.getSummaryschoolDirectorName(this.retiredDogModelData);
	// }
	// get schoolDirectorEmailAddress(): string {
	// 	return this.retiredDogApplicationService.getSummaryschoolDirectorEmailAddress(this.retiredDogModelData);
	// }
	// get schoolDirectorPhoneNumber(): string {
	// 	return this.retiredDogApplicationService.getSummaryschoolDirectorPhoneNumber(this.retiredDogModelData);
	// }

	// get trainerName(): string {
	// 	return this.retiredDogApplicationService.getSummarytrainerName(this.retiredDogModelData);
	// }
	// get trainerDateOfBirth(): string {
	// 	return this.retiredDogApplicationService.getSummarytrainerdateOfBirth(this.retiredDogModelData);
	// }
	// get trainerEmailAddress(): string {
	// 	return this.retiredDogApplicationService.getSummarytraineremailAddress(this.retiredDogModelData);
	// }
	// get trainerPhoneNumber(): string {
	// 	return this.retiredDogApplicationService.getSummarytrainerphoneNumber(this.retiredDogModelData);
	// }

	// get photoOfYourselfAttachments(): File[] | null {
	// 	return this.retiredDogApplicationService.getSummaryphotoOfYourselfAttachments(this.retiredDogModelData);
	// }

	// get governmentIssuedPhotoTypeCode(): LicenceDocumentTypeCode | null {
	// 	return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.retiredDogModelData);
	// }
	// get governmentIssuedPhotoExpiryDate(): string {
	// 	return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.retiredDogModelData);
	// }
	// get governmentIssuedPhotoAttachments(): File[] | null {
	// 	return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.retiredDogModelData);
	// }

	// get isNew(): boolean {
	// 	return this.applicationTypeCode === ApplicationTypeCode.New;
	// }
}
