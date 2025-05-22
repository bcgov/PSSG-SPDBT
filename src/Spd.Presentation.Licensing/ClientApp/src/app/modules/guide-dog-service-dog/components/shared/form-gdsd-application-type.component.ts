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
							Apply for a new certification if you've never held this type of certification, or if your existing
							certification has expired.
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
							Renew your existing certification before it expires, within 90 days of the expiry date.
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
							Lost your certificate? Request a replacement card and we'll send you one.
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
