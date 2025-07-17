import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PoliceOfficerRoleCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode, PoliceOfficerRoleTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { FileUploadComponent } from './file-upload.component';

@Component({
	selector: 'app-form-police-background',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div [ngClass]="isWizardStep ? 'col-md-8 col-sm-12 mx-auto' : 'col-12'">
					@if (isWizardStep) {
						<app-alert type="warning" icon="warning">
							<ng-container *ngTemplateOutlet="policeWarningMessage"></ng-container>
						</app-alert>
					} @else {
						<div class="fs-6 fw-bold m-3">
							<ng-container *ngTemplateOutlet="policeWarningMessage"></ng-container>
						</div>
					}
				</div>
			</div>

			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
					<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
						<div [ngClass]="isWizardStep ? '' : 'd-flex justify-content-start'">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							@if (isWizardStep) {
								<mat-divider class="my-2"></mat-divider>
							}
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					@if (
						(form.get('isPoliceOrPeaceOfficer')?.dirty || form.get('isPoliceOrPeaceOfficer')?.touched) &&
						form.get('isPoliceOrPeaceOfficer')?.invalid &&
						form.get('isPoliceOrPeaceOfficer')?.hasError('required')
					) {
						<mat-error class="mat-option-error">This is required</mat-error>
					}
				</div>
			</div>

			@if (isPoliceOrPeaceOfficer.value === booleanTypeCodes.Yes) {
				<div class="row my-4" @showHideTriggerSlideAnimation>
					<div [ngClass]="isWizardStep ? 'col-md-8 col-sm-12 mx-auto' : 'col-12'">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="row mt-2">
							<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Your Current Role</mat-label>
									<mat-select formControlName="policeOfficerRoleCode" [errorStateMatcher]="matcher">
										@for (item of policeOfficerRoleTypes; track item; let i = $index) {
											<mat-option [value]="item.code">
												{{ item.desc }}
											</mat-option>
										}
									</mat-select>
									@if (form.get('policeOfficerRoleCode')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							@if (policeOfficerRoleCode.value === policeOfficerRoleCodeOther) {
								<div class="col-xl-5 col-lg-12 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Describe Role</mat-label>
										<input matInput formControlName="otherOfficerRole" [errorStateMatcher]="matcher" maxlength="50" />
										@if (form.get('otherOfficerRole')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
									</mat-form-field>
								</div>
							}
						</div>
						@if (form.hasError('nopoliceofficer')) {
							<app-alert type="danger" icon="dangerous">
								A member of a police force may not hold a security worker licence. Your application for a security
								worker licence will NOT be accepted.
							</app-alert>
						}
						<div class="mt-2">
							<div class="text-minor-heading mb-2">Upload a letter of no conflict from your superior officer:</div>
							<p>
								The letter from your supervisor must confirm any access you have to justice, court or police information
								systems (PRIME/PIRS/PROS/CPIC or other police or corrections database). You cannot utilize information
								from these systems while acting in the capacity of a security worker. See Section 2.5.4 of the
								<a
									aria-label="Navigate to Security Licensing Process and Licence Conditions Policies site"
									[href]="securityLicensingProcessAndLicenceConditionsPoliciesUrl"
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
							@if (
								(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
								form.get('attachments')?.invalid &&
								form.get('attachments')?.hasError('required')
							) {
								<mat-error class="mat-option-error">This is required</mat-error>
							}
						</div>
					</div>
				</div>
			}
		</form>

		<ng-template #policeWarningMessage>
			A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker
			licence.
		</ng-template>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormPoliceBackgroundComponent {
	securityLicensingProcessAndLicenceConditionsPoliciesUrl =
		SPD_CONSTANTS.urls.securityLicensingProcessAndLicenceConditionsPoliciesUrl;

	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodeOther = PoliceOfficerRoleCode.Other;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;
	warningMessage = `A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker licence.`;

	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isWizardStep = false;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
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
