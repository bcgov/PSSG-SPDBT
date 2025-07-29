import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-summary',
	template: `
		@if (retiredDogModelData) {
			<app-step-section
				heading="Registration summary"
				subheading="Review your information before submitting your application."
			>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<mat-accordion multi="true">
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
										[formData]="retiredDogModelData.mailingAddressData"
										headingLabel="Mailing Address"
										[isAddressTheSame]="false"
									></app-form-address-summary>
									@if (isNew) {
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading-small">Guide or Service Dog Certificate</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Certificate #</div>
												<div class="summary-text-data">
													{{ currentGDSDCertificateNumber | default }}
												</div>
											</div>
											<div class="col-lg-8 col-md-12">
												<div class="text-label d-block text-muted">Guide or Service Dog Certificate</div>
												<div class="summary-text-data">
													<ul class="m-0">
														@for (doc of gdsdCertificateAttachments; track doc; let i = $index) {
															<li>{{ doc.name }}</li>
														}
													</ul>
												</div>
											</div>
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
										@if (isNew) {
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Date of Retirement</div>
												<div class="summary-text-data">
													{{ dogRetiredDate | formatDate | default }}
												</div>
											</div>
										}
										<div class="col-lg-8 col-md-12">
											<div class="text-label d-block text-muted">Continue to live with dog in his/her retirement?</div>
											<div class="summary-text-data">
												{{ liveWithDog | default }}
											</div>
										</div>
									</div>
								</div>
							</mat-expansion-panel>
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

	onEditStep(event: any, stepNumber: number) {
		event.stopPropagation();
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

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	get applicantName(): string {
		return this.retiredDogApplicationService.getSummaryapplicantName(this.retiredDogModelData);
	}
	get dateOfBirth(): string {
		return this.retiredDogApplicationService.getSummarydateOfBirth(this.retiredDogModelData);
	}
	get emailAddress(): string {
		return this.retiredDogApplicationService.getSummaryemailAddress(this.retiredDogModelData);
	}
	get phoneNumber(): string {
		return this.retiredDogApplicationService.getSummaryphoneNumber(this.retiredDogModelData);
	}

	get currentGDSDCertificateNumber(): string {
		return this.retiredDogApplicationService.getSummarycurrentGDSDCertificateNumber(this.retiredDogModelData);
	}
	get gdsdCertificateAttachments(): File[] | null {
		return this.retiredDogApplicationService.getSummarygdsdCertificateAttachments(this.retiredDogModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.retiredDogApplicationService.getSummaryphotoOfYourselfAttachments(this.retiredDogModelData);
	}

	get governmentIssuedPhotoTypeCode(): LicenceDocumentTypeCode | null {
		return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.retiredDogModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.retiredDogModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] | null {
		return this.retiredDogApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.retiredDogModelData);
	}

	get dogName(): string {
		return this.retiredDogApplicationService.getSummarydogName(this.retiredDogModelData);
	}
	get dogDateOfBirth(): string {
		return this.retiredDogApplicationService.getSummarydogDateOfBirth(this.retiredDogModelData);
	}
	get dogBreed(): string {
		return this.retiredDogApplicationService.getSummarydogBreed(this.retiredDogModelData);
	}
	get colourAndMarkings(): string {
		return this.retiredDogApplicationService.getSummarycolourAndMarkings(this.retiredDogModelData);
	}
	get genderCode(): string {
		return this.retiredDogApplicationService.getSummarygenderCode(this.retiredDogModelData);
	}
	get microchipNumber(): string {
		return this.retiredDogApplicationService.getSummarymicrochipNumber(this.retiredDogModelData);
	}
	get dogRetiredDate(): string {
		return this.retiredDogApplicationService.getSummarydogRetiredDate(this.retiredDogModelData);
	}
	get liveWithDog(): string {
		return this.retiredDogApplicationService.getSummaryliveWithDog(this.retiredDogModelData);
	}
}
