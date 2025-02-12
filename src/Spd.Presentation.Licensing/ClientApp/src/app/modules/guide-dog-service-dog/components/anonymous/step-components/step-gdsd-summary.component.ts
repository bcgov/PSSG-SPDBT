import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-summary',
	template: `
		<app-step-section
			title="Registration Summary"
			subtitle="Review your information before submitting your application."
			*ngIf="gdsdModelData"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Certificate Selection</div>
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
								<div class="row mt-0">
									<div class="col-lg-12 col-md-12">
										<div class="text-label d-block text-muted">
											Is your dog trained by Assistance Dogs International or International Guide Dog Federation
											accredited schools?
										</div>
										<div class="summary-text-data">
											{{ isDogTrainedByAccreditedSchool | default }}
										</div>
									</div>
								</div>
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
								<div class="text-minor-heading-small mt-2">Personal Information</div>
								<div class="row mt-0">
									<div class="col-lg-12 col-md-12">
										<div class="text-label d-block text-muted">Applicant Name</div>
										<div class="summary-text-data">{{ applicantName }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ dateOfBirth | formatDate | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ phoneNumber | formatPhoneNumber }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ emailAddress | default }}</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<app-form-address-summary
									[formData]="gdsdModelData.mailingAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<ng-container *ngIf="!isTrainedByAccreditedSchools">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">
										Medical Form Confirming Requirement for Guide Dog or Service Dog
									</div>
									<div class="row mt-0">
										<div class="col-lg-8 col-md-12">
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of medicalInformationAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</div>
								</ng-container>

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
								</div>
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
								<div class="text-minor-heading-small mt-2">Dog Information</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Dog Name</div>
										<div class="summary-text-data">{{ dogName | default }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ dogDateOfBirth | formatDate | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Breed</div>
										<div class="summary-text-data">
											{{ dogBreed | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Colour And Markings</div>
										<div class="summary-text-data">{{ colourAndMarkings | default }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Gender</div>
										<div class="summary-text-data">{{ genderCode | options: 'GenderTypes' | default }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Microchip Number</div>
										<div class="summary-text-data">{{ microchipNumber | default }}</div>
									</div>
									<div class="col-12">
										<div class="text-label d-block text-muted">Dog Type</div>
										<div class="summary-text-data">
											{{ dogType | default }}
										</div>
									</div>
								</div>

								<ng-container *ngIf="!isTrainedByAccreditedSchools">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Dog Medical Information</div>
									<div class="row mt-0">
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Inoculations Up-to-date</div>
											<div class="summary-text-data">
												{{ areInoculationsUpToDate | options: 'BooleanTypes' | default }}
											</div>
										</div>
										<div class="col-lg-8 col-md-12">
											<div class="text-label d-block text-muted">Certification from a BC Veterinarian</div>
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of dogMedicalAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</div>
								</ng-container>
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
								<ng-container *ngIf="isTrainedByAccreditedSchools; else NonAccreditedTraining">
									<app-gdsd-summary-accredited-training
										[gdsdModelData]="gdsdModelData"
									></app-gdsd-summary-accredited-training>
								</ng-container>

								<ng-template #NonAccreditedTraining>
									<ng-container *ngIf="hasAttendedTrainingSchool; else NotAttendedTrainingSchool">
										<app-gdsd-summary-school-training
											[gdsdModelData]="gdsdModelData"
										></app-gdsd-summary-school-training>
									</ng-container>

									<ng-template #NotAttendedTrainingSchool>
										<app-gdsd-summary-other-training [gdsdModelData]="gdsdModelData"></app-gdsd-summary-other-training>
									</ng-template>
								</ng-template>

								<ng-container *ngIf="(isTrainedByAccreditedSchools && isServiceDog) || !isTrainedByAccreditedSchools">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Specialized Tasks</div>
									<div class="row mt-0">
										<div class="col-lg-12 col-md-12">
											<div class="summary-text-data">
												{{ specializedTaskDetails }}
											</div>
										</div>
									</div>
								</ng-container>
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

	@Input() isTrainedByAccreditedSchools!: boolean;
	@Input() hasAttendedTrainingSchool!: boolean;
	@Input() isServiceDog!: boolean;

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

	get isDogTrainedByAccreditedSchool(): string {
		return this.gdsdApplicationService.getSummaryisDogTrainedByAccreditedSchool(this.gdsdModelData);
	}
	get dogType(): string {
		return this.gdsdApplicationService.getSummarydogType(this.gdsdModelData);
	}
	get applicantName(): string {
		return this.gdsdApplicationService.getSummaryapplicantName(this.gdsdModelData);
	}
	get dateOfBirth(): string {
		return this.gdsdApplicationService.getSummarydateOfBirth(this.gdsdModelData);
	}
	get emailAddress(): string {
		return this.gdsdApplicationService.getSummaryemailAddress(this.gdsdModelData);
	}
	get phoneNumber(): string {
		return this.gdsdApplicationService.getSummaryphoneNumber(this.gdsdModelData);
	}

	get dogName(): string {
		return this.gdsdApplicationService.getSummarydogName(this.gdsdModelData);
	}
	get dogDateOfBirth(): string {
		return this.gdsdApplicationService.getSummarydogDateOfBirth(this.gdsdModelData);
	}
	get dogBreed(): string {
		return this.gdsdApplicationService.getSummarydogBreed(this.gdsdModelData);
	}
	get colourAndMarkings(): string {
		return this.gdsdApplicationService.getSummarycolourAndMarkings(this.gdsdModelData);
	}
	get genderCode(): string {
		return this.gdsdApplicationService.getSummarygenderCode(this.gdsdModelData);
	}
	get microchipNumber(): string {
		return this.gdsdApplicationService.getSummarymicrochipNumber(this.gdsdModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummaryphotoOfYourselfAttachments(this.gdsdModelData);
	}

	get areInoculationsUpToDate(): string {
		return this.gdsdApplicationService.getSummaryareInoculationsUpToDate(this.gdsdModelData);
	}

	get medicalInformationAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarymedicalInformationAttachments(this.gdsdModelData);
	}

	get governmentIssuedPhotoTypeCode(): LicenceDocumentTypeCode | null {
		return this.gdsdApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.gdsdModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.gdsdApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.gdsdModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.gdsdModelData);
	}

	get dogMedicalAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarydogMedicalAttachments(this.gdsdModelData);
	}

	get specializedTaskDetails(): string {
		return this.gdsdApplicationService.getSummaryspecializedTaskDetails(this.gdsdModelData);
	}
}
