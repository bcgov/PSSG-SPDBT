import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-common-user-profile-licence-mental-health-conditions',
	template: `
		<mat-accordion>
			<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
				<mat-expansion-panel-header>
					<mat-panel-title>Mental Health Condition</mat-panel-title>
				</mat-expansion-panel-header>

				<div class="mt-3">
					<div class="py-2">{{ title }}</div>
					<app-alert type="info" icon="" [showBorder]="false" *ngIf="subTitle">
						{{ subTitle }}
					</app-alert>

					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isTreatedForMHC')?.dirty || form.get('isTreatedForMHC')?.touched) &&
										form.get('isTreatedForMHC')?.invalid &&
										form.get('isTreatedForMHC')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row my-4" *ngIf="isTreatedForMHC.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<div class="col-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<p>
									If you don't have a completed form, you can download and provide it to your physician to fill out, or
									your physician may download it and fill the form out on a computer if you provide them with the
									required information. See the
									<a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/07030_01" target="_blank">
										Security Services Act</a
									>, s. 3, Security Services Regulation, s. 4(1)(e) for more information
								</p>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">Upload your mental health condition form</div>
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
					</form>
				</div>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonUserProfileLicenceMentalHealthConditionsComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	subTitle = '';
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (
			this.applicationTypeCode === ApplicationTypeCode.Update ||
			this.applicationTypeCode === ApplicationTypeCode.Renewal
		) {
			if (this.hasPreviousMhcFormUpload.value) {
				// If they uploaded a MHC form during the previous application
				this.title =
					'Has your mental health condition changed since you last submitted a mental health condition form?';
			} else {
				// If they have never uploaded a MHC form before, show this
				this.title = 'Have you been treated for a mental health condition in the last 3 years?';
			}
		} else {
			this.title = 'Have you been treated for any mental health conditions?';
			this.subTitle =
				'An individual applying for a security worker licence must provide particulars of any mental health condition for which the individual has received treatment';
		}
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}

	get hasPreviousMhcFormUpload(): FormControl {
		return this.form.get('hasPreviousMhcFormUpload') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
