import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-gdsd-personal-info-anonymous',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Legal First Name</mat-label>
								<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Surname</mat-label>
								<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Date of Birth</mat-label>
								<input
									matInput
									formControlName="dateOfBirth"
									[mask]="dateMask"
									[showMaskTyped]="true"
									[errorStateMatcher]="matcher"
									(blur)="onValidateDate()"
									aria-label="Date in format YYYY-MM-DD"
								/>
								<!-- We always want the date format hint to display -->
								<mat-hint *ngIf="!showHintError">Date format YYYY-MM-DD</mat-hint>
								<mat-error *ngIf="showHintError">
									<span class="hint-inline">Date format YYYY-MM-DD</span>
								</mat-error>
								<mat-error *ngIf="dateOfBirth?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="dateOfBirth?.hasError('invalidDate')">This date is invalid</mat-error>
								<mat-error *ngIf="dateOfBirth?.hasError('futureDate')">This date cannot be in the future</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="phoneNumber"
									[mask]="phoneMask"
									[showMaskTyped]="false"
									[errorStateMatcher]="matcher"
								/>
								<mat-hint>A 10 digit phone number</mat-hint>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Email Address <span class="optional-label">(optional)</span></mat-label>
								<input
									matInput
									formControlName="emailAddress"
									[errorStateMatcher]="matcher"
									placeholder="name@domain.com"
									maxlength="75"
								/>
								<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
									Must be a valid email address
								</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdPersonalInfoAnonymousComponent {
	applicationTypeCodes = ApplicationTypeCode;
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	dateMask = SPD_CONSTANTS.date.dateMask;

	@Input() form!: FormGroup;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private utilService: UtilService) {}

	onValidateDate(): void {
		const errorKey = this.utilService.getIsInputValidDate(this.dateOfBirth.value, true);
		if (errorKey) {
			this.dateOfBirth.setErrors({ [errorKey]: true });
		}
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
	get showHintError(): boolean {
		return (this.dateOfBirth?.dirty || this.dateOfBirth?.touched) && this.dateOfBirth?.invalid;
	}
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
}
