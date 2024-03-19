import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-contact-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'offset-lg-2' : ''">
					<mat-form-field>
						<mat-label>Email Address</mat-label>
						<input
							matInput
							formControlName="emailAddress"
							[errorStateMatcher]="matcher"
							placeholder="name@domain.com"
							maxlength="75"
						/>
						<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
						<mat-error *ngIf="form.get('emailAddress')?.hasError('email')"> Must be a valid email address </mat-error>
					</mat-form-field>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Phone Number</mat-label>
						<input matInput formControlName="phoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
						<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
						<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonContactInformationComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;
}
