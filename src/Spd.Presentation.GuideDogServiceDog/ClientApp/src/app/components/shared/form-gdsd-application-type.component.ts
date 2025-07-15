import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';

@Component({
	selector: 'app-form-gdsd-application-type',
	template: `
		<form [formGroup]="form" novalidate>
			<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
				<div class="row">
					<div class="col-lg-4">
						<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
					</div>
					<div class="col-lg-8">
						<app-alert type="info" icon="">
							{{ newInfoText }}
						</app-alert>
					</div>
				</div>
				<mat-divider class="mb-3"></mat-divider>
				<div class="row">
					<div class="col-lg-4">
						<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal">Renewal</mat-radio-button>
					</div>
					<div class="col-lg-8">
						<app-alert type="info" icon="">
							{{ renewalInfoText }}
						</app-alert>
					</div>
				</div>
				<mat-divider class="mb-3"></mat-divider>
				<div class="row">
					<div class="col-lg-4">
						<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Replacement">
							Replacement
						</mat-radio-button>
					</div>
					<div class="col-lg-8">
						<app-alert type="info" icon="">
							{{ replacementInfoText }}
						</app-alert>
					</div>
				</div>
			</mat-radio-group>
		</form>
		@if (
			(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
			form.get('applicationTypeCode')?.invalid &&
			form.get('applicationTypeCode')?.hasError('required')
		) {
			<mat-error class="mat-option-error">An option must be selected</mat-error>
		}
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdApplicationTypeComponent implements OnInit {
	applicationTypeCodes = ApplicationTypeCode;

	newInfoText = '';
	renewalInfoText = '';
	replacementInfoText = '';

	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;

	ngOnInit(): void {
		if (this.serviceTypeCode === ServiceTypeCode.DogTrainerCertification) {
			this.newInfoText =
				'Select this if the trainer has never held this certification before, or if a previous certification has expired.';
			this.renewalInfoText =
				'Select this if the trainer currently holds a valid certification and is renewing it within 90 days of expiry.';
			this.replacementInfoText =
				"Select this if the trainer's certificate has been lost or damaged and needs to be reissued.";
			return;
		}

		this.newInfoText =
			'Select this if you’ve never had this certification before, or if your previous certification has expired.';
		this.renewalInfoText =
			'Select this if you currently have a certification and want to renew it within 90 days of its expiry.';
		this.replacementInfoText = 'Select this if your certificate has been lost or damaged and you need a replacement.';
	}
}
