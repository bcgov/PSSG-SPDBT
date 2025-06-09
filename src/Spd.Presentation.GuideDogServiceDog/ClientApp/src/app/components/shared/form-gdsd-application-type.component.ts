import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';

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
							Select this if you’ve never had this certification before, or if your previous certification has expired.
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
							Select this if you currently have a certification and want to renew it within 90 days of its expiry.
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
							Select this if your certificate has been lost or damaged and you need a replacement.
						</app-alert>
					</div>
				</div>
			</mat-radio-group>
		</form>
		<mat-error
			class="mat-option-error"
			*ngIf="
				(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
				form.get('applicationTypeCode')?.invalid &&
				form.get('applicationTypeCode')?.hasError('required')
			"
			>An option must be selected</mat-error
		>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdApplicationTypeComponent {
	applicationTypeCodes = ApplicationTypeCode;

	@Input() form!: FormGroup;
}
