import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { BooleanTypeCode, PoliceOfficerRoleTypes } from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-police-background',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>

				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isPoliceOrPeaceOfficer')?.dirty || form.get('isPoliceOrPeaceOfficer')?.touched) &&
										form.get('isPoliceOrPeaceOfficer')?.invalid &&
										form.get('isPoliceOrPeaceOfficer')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>

							<div class="row my-4" *ngIf="isPoliceOrPeaceOfficer.value === booleanTypeCodes.Yes">
								<div class="offset-md-2 col-md-8 col-sm-12">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
									<div class="row mt-2">
										<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12">
											<mat-form-field>
												<mat-label>Your current role</mat-label>
												<mat-select formControlName="policeOfficerRoleCode" [errorStateMatcher]="matcher">
													<mat-option *ngFor="let item of policeOfficerRoleTypes" [value]="item.code">
														{{ item.desc }}
													</mat-option>
												</mat-select>
												<mat-error *ngIf="form.get('policeOfficerRoleCode')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
										<div
											class="col-xl-5 col-lg-12 col-md-12 col-sm-12"
											*ngIf="policeOfficerRoleCode.value === policeOfficerRoleCodes.Other"
										>
											<mat-form-field>
												<mat-label>Describe Role</mat-label>
												<input
													matInput
													formControlName="otherOfficerRole"
													[errorStateMatcher]="matcher"
													maxlength="50"
												/>
												<mat-error *ngIf="form.get('otherOfficerRole')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
									</div>

									<app-alert
										type="danger"
										icon="error"
										*ngIf="policeOfficerRoleCode.value === policeOfficerRoleCodes.PoliceOfficer"
									>
										A member of a police force may not hold a security worker licence. Your application for a security
										worker licence will NOT be accepted.
									</app-alert>

									<div class="row mt-2">
										<div class="col-12">
											<div class="text-minor-heading mb-2">
												Upload a letter of no conflict from your superior officer:
											</div>
											<p>
												The letter from your supervisor must confirm any access you have to justice, court or police
												information systems (PRIME/PIRS/PROS/CPIC or other police or corrections database). You cannot
												utilize information from these systems while acting in the capacity of a security worker. See
												Section 2.5.4 of the
												<a
													href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
													target="_blank"
												>
													Security Licensing Process and Licence Conditions Policies</a
												>
												for more information.
											</p>
											<app-file-upload
												(fileUploaded)="onFileUploaded($event)"
												(fileRemoved)="onFileRemoved()"
												[control]="attachments"
												[maxNumberOfFiles]="1"
												[files]="attachments.value"
											></app-file-upload>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
													form.get('attachments')?.invalid &&
													form.get('attachments')?.hasError('required')
												"
												>This is required</mat-error
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;
	applicationTypeCodes = ApplicationTypeCode;

	policeOfficerSummaryText = '';

	matcher = new FormErrorStateMatcher();
	title = '';
	subtitle = '';

	readonly title_confirm = 'Are you currently a Police Officer or Peace Officer?';
	readonly title_view = 'Confirm your Police Officer or Peace Officer information';
	readonly subtitle_auth_new =
		'A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker licence.';
	readonly subtitle_unauth_renew_update = 'Update any information that has changed since your last application';

	form: FormGroup = this.licenceApplicationService.policeBackgroundFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.title = this.title_confirm;
		this.subtitle = this.subtitle_auth_new;
	}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);
						this.hotToastService.error('An error occurred during the file upload. Please try again.');
						this.fileUploadComponent.removeFailedFile(file);
					},
				});
		}
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isPoliceOrPeaceOfficer(): FormControl {
		return this.form.get('isPoliceOrPeaceOfficer') as FormControl;
	}

	get policeOfficerRoleCode(): FormControl {
		return this.form.get('policeOfficerRoleCode') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
