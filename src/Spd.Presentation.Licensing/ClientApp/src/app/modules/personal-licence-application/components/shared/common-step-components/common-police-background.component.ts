import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode, PoliceOfficerRoleTypes } from '@app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-police-background',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isCalledFromStep ? 'mx-auto' : ''">
					<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
						<div [ngClass]="isCalledFromStep ? '' : 'd-flex justify-content-start'">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2" *ngIf="isCalledFromStep"></mat-divider>
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

				<div
					class="row my-4"
					*ngIf="isPoliceOrPeaceOfficer.value === booleanTypeCodes.Yes"
					@showHideTriggerSlideAnimation
				>
					<div [ngClass]="isCalledFromStep ? 'offset-md-2 col-md-8 col-sm-12' : 'col-12'">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="row mt-2">
							<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Your Current Role</mat-label>
									<mat-select formControlName="policeOfficerRoleCode" [errorStateMatcher]="matcher">
										<mat-option *ngFor="let item of policeOfficerRoleTypes; let i = index" [value]="item.code">
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
								*ngIf="policeOfficerRoleCode.value === policeOfficerRoleCodeOther"
							>
								<mat-form-field>
									<mat-label>Describe Role</mat-label>
									<input matInput formControlName="otherOfficerRole" [errorStateMatcher]="matcher" maxlength="50" />
									<mat-error *ngIf="form.get('otherOfficerRole')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<app-alert type="danger" icon="error" *ngIf="form.hasError('nopoliceofficer')">
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
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonPoliceBackgroundComponent {
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodeOther = PoliceOfficerRoleCode.Other;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;

	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isCalledFromStep = false;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.fileUploaded(
			LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.licenceApplicationService.fileRemoved();
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
