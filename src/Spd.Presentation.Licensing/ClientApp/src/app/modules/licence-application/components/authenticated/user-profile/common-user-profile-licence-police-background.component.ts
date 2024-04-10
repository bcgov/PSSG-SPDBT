import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode, PoliceOfficerRoleTypes } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-user-profile-licence-police-background',
	template: `
		<div class="text-minor-heading pt-2">Police Background</div>
		<div class="py-2">{{ title }}</div>

		<ng-container *ngIf="isRenewalOrUpdate">
			<app-alert type="info" icon="" [showBorder]="false">
				Update any information that has changed since your last application
			</app-alert>
		</ng-container>

		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
					<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
						<div class="d-flex justify-content-start">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
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
					<div class="col-12">
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
									<input matInput formControlName="otherOfficerRole" [errorStateMatcher]="matcher" maxlength="50" />
									<mat-error *ngIf="form.get('otherOfficerRole')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<app-alert
							type="danger"
							icon="error"
							*ngIf="policeOfficerRoleCode.value === policeOfficerRoleCodes.PoliceOfficer"
						>
							A member of a police force may not hold a security worker licence. Your application for a security worker
							licence will NOT be accepted.
						</app-alert>

						<div class="row mt-2">
							<div class="col-12">
								<div class="text-minor-heading mb-2">Upload a letter of no conflict from your superior officer:</div>
								<p>
									The letter from your supervisor must confirm any access you have to justice, court or police
									information systems (PRIME/PIRS/PROS/CPIC or other police or corrections database). You cannot utilize
									information from these systems while acting in the capacity of a security worker. See Section 2.5.4 of
									the
									<a
										href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
										target="_blank"
									>
										Security Licensing Process and Licence Conditions Policies</a
									>
									for more information.
								</p>
								<app-file-upload
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
	`,
	styles: [],
})
export class CommonUserProfileLicencePoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;

	title = '';

	matcher = new FormErrorStateMatcher();

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.licenceApplicationService.policeBackgroundFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (
			this.applicationTypeCode === ApplicationTypeCode.Update ||
			this.applicationTypeCode === ApplicationTypeCode.Renewal
		) {
			this.title = 'Do you now hold any Police Officer or Peace Officer roles?';
		} else {
			this.title = 'Are you currently a Police Officer or Peace Officer?';
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
	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
