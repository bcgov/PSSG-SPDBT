import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-summary',
	template: `
		@if (gdsdModelData) {
			<app-step-section
				heading="Registration summary"
				subheading="Review your information before submitting your application."
			>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<mat-accordion multi="true">
							@if (isNew) {
								<mat-expansion-panel class="mb-4" [expanded]="true" [disabled]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Certificate Selection</div>
												<button
													mat-flat-button
													color="primary"
													class="w-auto"
													aria-label="Go to Step"
													(click)="onEditStep($event, 0)"
													(keydown.enter)="onEditStep($event, 0)"
													(keydown.space)="onEditStep($event, 0)"
												>
													Edit
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
							}
							<mat-expansion-panel class="mb-4" [expanded]="true" [disabled]="true">
								<mat-expansion-panel-header>
									<mat-panel-title class="review-panel-title">
										<mat-toolbar class="d-flex justify-content-between">
											<div class="panel-header">Personal Information</div>
											<button
												mat-flat-button
												color="primary"
												class="w-auto"
												aria-label="Go to Step"
												(click)="onEditStep($event, 1)"
												(keydown.enter)="onEditStep($event, 1)"
												(keydown.space)="onEditStep($event, 1)"
											>
												Edit
											</button>
										</mat-toolbar>
									</mat-panel-title>
								</mat-expansion-panel-header>
								<div class="panel-body">
									<div class="text-minor-heading-small mt-2">Applicant Information</div>
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
												{{ phoneNumber | formatPhoneNumber | default }}
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
									@if (isNew && !isTrainedByAccreditedSchools) {
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading-small">
											Medical Form Confirming Requirement for Guide Dog or Service Dog
										</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Doctor Sends Medical Forms</div>
												<div class="summary-text-data">
													{{ doctorIsProvidingNeedDogMedicalForm | default }}
												</div>
											</div>
											@if (medicalInformationAttachments) {
												<div class="col-lg-8 col-md-12">
													<div class="summary-text-data">
														<ul class="m-0">
															@for (doc of medicalInformationAttachments; track doc; let i = $index) {
																<li>{{ doc.name }}</li>
															}
														</ul>
													</div>
												</div>
											}
										</div>
									}
									@if (photoOfYourselfAttachments) {
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading-small">Photo of Yourself</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="summary-text-data">
													<ul class="m-0">
														@for (doc of photoOfYourselfAttachments; track doc; let i = $index) {
															<li>{{ doc.name }}</li>
														}
													</ul>
												</div>
											</div>
										</div>
									}
									@if (!isNew && isTrainedByAccreditedSchool) {
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading-small">Accredited School Identification Card</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="summary-text-data">
													<ul class="m-0">
														@for (doc of accreditedSchoolIdCardAttachments; track doc; let i = $index) {
															<li>{{ doc.name }}</li>
														}
													</ul>
												</div>
											</div>
										</div>
									}
									<mat-divider class="mt-3 mb-2"></mat-divider>
									<div class="text-minor-heading-small">
										{{ governmentIssuedPhotoTypeCode | options: 'GovernmentIssuedPhotoIdTypes' }}
									</div>
									<div class="row mt-0">
										<div class="col-lg-6 col-md-12">
											<div class="summary-text-data">
												<ul class="m-0">
													@for (doc of governmentIssuedPhotoAttachments; track doc; let i = $index) {
														<li>{{ doc.name }}</li>
													}
												</ul>
											</div>
										</div>
									</div>
								</div>
							</mat-expansion-panel>
							<mat-expansion-panel class="mb-4" [expanded]="true" [disabled]="true">
								<mat-expansion-panel-header>
									<mat-panel-title class="review-panel-title">
										<mat-toolbar class="d-flex justify-content-between">
											<div class="panel-header">Dog Information</div>
											<button
												mat-flat-button
												color="primary"
												class="w-auto"
												aria-label="Go to Step"
												(click)="onEditStep($event, 2)"
												(keydown.enter)="onEditStep($event, 2)"
												(keydown.space)="onEditStep($event, 2)"
											>
												Edit
											</button>
										</mat-toolbar>
									</mat-panel-title>
								</mat-expansion-panel-header>
								<div class="panel-body">
									@if (isNew) {
										<div class="text-minor-heading-small mt-2">Dog Information</div>
									}
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
											<div class="text-label d-block text-muted">Colour and Markings</div>
											<div class="summary-text-data">{{ colourAndMarkings | default }}</div>
										</div>
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Gender</div>
											<div class="summary-text-data">{{ genderCode | options: 'DogGenderTypes' | default }}</div>
										</div>
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Microchip Number</div>
											<div class="summary-text-data">{{ microchipNumber | default }}</div>
										</div>
										@if (!isNew) {
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Dog's Assistance Required</div>
												<div class="summary-text-data">
													{{ isAssistanceStillRequired | default }}
												</div>
											</div>
										}
										@if (isNew) {
											<div class="col-12">
												<div class="text-label d-block text-muted">Dog Type</div>
												<div class="summary-text-data">
													{{ dogType | default }}
												</div>
											</div>
										}
									</div>
									@if (isNew && !isTrainedByAccreditedSchools) {
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
														@for (doc of dogMedicalAttachments; track doc; let i = $index) {
															<li>{{ doc.name }}</li>
														}
													</ul>
												</div>
											</div>
										</div>
									}
								</div>
							</mat-expansion-panel>
							@if (isNew) {
								<mat-expansion-panel class="mb-4" [expanded]="true" [disabled]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Training Information</div>
												<button
													mat-flat-button
													color="primary"
													class="w-auto"
													aria-label="Go to Step"
													(click)="onEditStep($event, 3)"
													(keydown.enter)="onEditStep($event, 3)"
													(keydown.space)="onEditStep($event, 3)"
												>
													Edit
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										@if (isTrainedByAccreditedSchools) {
											<app-form-team-summary-accredited-training
												[gdsdModelData]="gdsdModelData"
											></app-form-team-summary-accredited-training>
										} @else {
											@if (hasAttendedTrainingSchool) {
												<app-form-team-summary-school-training
													[gdsdModelData]="gdsdModelData"
												></app-form-team-summary-school-training>
											} @else {
												<app-form-team-summary-other-training
													[gdsdModelData]="gdsdModelData"
												></app-form-team-summary-other-training>
											}
										}
										@if ((isTrainedByAccreditedSchools && isServiceDog) || !isTrainedByAccreditedSchools) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small mb-2">Specialized Tasks</div>
											<div class="row mt-0">
												<div class="col-lg-12 col-md-12">
													<div class="summary-text-data">
														{{ specializedTaskDetails }}
													</div>
												</div>
											</div>
										}
									</div>
								</mat-expansion-panel>
							}
						</mat-accordion>
					</div>
				</div>
			</app-step-section>
		}
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
export class StepTeamSummaryComponent implements OnInit, LicenceChildStepperStepComponent {
	gdsdModelData: any = {};

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;
	@Input() hasAttendedTrainingSchool!: boolean;
	@Input() isServiceDog!: boolean;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit(): void {
		this.gdsdModelData = {
			...this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.getRawValue(),
		};
	}

	onEditStep(event: any, stepNumber: number) {
		event.stopPropagation();
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.gdsdModelData = {
			...this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	get isDogTrainedByAccreditedSchool(): string {
		return this.gdsdTeamApplicationService.getSummaryisDogTrainedByAccreditedSchool(this.gdsdModelData);
	}
	get isAssistanceStillRequired(): string {
		return this.gdsdTeamApplicationService.getSummaryisAssistanceStillRequired(this.gdsdModelData);
	}
	get dogType(): string {
		return this.gdsdTeamApplicationService.getSummarydogType(this.gdsdModelData);
	}
	get applicantName(): string {
		return this.gdsdTeamApplicationService.getSummaryapplicantName(this.gdsdModelData);
	}
	get dateOfBirth(): string {
		return this.gdsdTeamApplicationService.getSummarydateOfBirth(this.gdsdModelData);
	}
	get emailAddress(): string {
		return this.gdsdTeamApplicationService.getSummaryemailAddress(this.gdsdModelData);
	}
	get phoneNumber(): string {
		return this.gdsdTeamApplicationService.getSummaryphoneNumber(this.gdsdModelData);
	}

	get dogName(): string {
		return this.gdsdTeamApplicationService.getSummarydogName(this.gdsdModelData);
	}
	get dogDateOfBirth(): string {
		return this.gdsdTeamApplicationService.getSummarydogDateOfBirth(this.gdsdModelData);
	}
	get dogBreed(): string {
		return this.gdsdTeamApplicationService.getSummarydogBreed(this.gdsdModelData);
	}
	get colourAndMarkings(): string {
		return this.gdsdTeamApplicationService.getSummarycolourAndMarkings(this.gdsdModelData);
	}
	get genderCode(): string {
		return this.gdsdTeamApplicationService.getSummarygenderCode(this.gdsdModelData);
	}
	get microchipNumber(): string {
		return this.gdsdTeamApplicationService.getSummarymicrochipNumber(this.gdsdModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummaryphotoOfYourselfAttachments(this.gdsdModelData);
	}

	get areInoculationsUpToDate(): string {
		return this.gdsdTeamApplicationService.getSummaryareInoculationsUpToDate(this.gdsdModelData);
	}

	get medicalInformationAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarymedicalInformationAttachments(this.gdsdModelData);
	}
	get doctorIsProvidingNeedDogMedicalForm(): string {
		return this.gdsdTeamApplicationService.getSummaryisDoctorSendingGdsdMedicalForm(this.gdsdModelData);
	}

	get accreditedSchoolIdCardAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummaryaccreditedSchoolIdCardAttachments(this.gdsdModelData);
	}

	get governmentIssuedPhotoTypeCode(): LicenceDocumentTypeCode | null {
		return this.gdsdTeamApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.gdsdModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.gdsdTeamApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.gdsdModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.gdsdModelData);
	}

	get dogMedicalAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarydogMedicalAttachments(this.gdsdModelData);
	}

	get specializedTaskDetails(): string {
		return this.gdsdTeamApplicationService.getSummaryspecializedTaskDetails(this.gdsdModelData);
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get isTrainedByAccreditedSchool(): boolean {
		return this.isDogTrainedByAccreditedSchool === BooleanTypeCode.Yes;
	}
}
