import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-personal-information',
	template: `
		<form [formGroup]="form" novalidate>
			<app-alert type="info" icon="">
				Have you changed your name?
				<a href="https://www.icbc.com/driver-licensing/getting-licensed/Change-your-name-or-address" target="_blank"
					>Visit ICBC</a
				>
				to update this information on your BC Services Card. Any changes you make will then be updated here.
			</app-alert>

			<div class="row mx-0 mb-4">
				<div class="col-lg-6 col-md-12 mt-2 mt-lg-0">
					<div class="fs-6 text-muted me-3">Full Name</div>
					<div class="fs-5" style="color: var(--color-primary);">
						{{ fullname }}
					</div>
				</div>

				<div class="col-lg-6 col-md-12 mt-2 mt-lg-0">
					<div class="fs-6 text-muted me-3">Date of Birth</div>
					<div class="fs-5" style="color: var(--color-primary);">
						{{ dateOfBirth.value | formatDate : constants.date.formalDateFormat }}
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Sex <span class="optional-label">(optional)</span></mat-label>
						<mat-select formControlName="genderCode">
							<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
								{{ gdr.desc }}
							</mat-option>
						</mat-select>
						<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class PersonalInformationComponent implements OnInit, OnDestroy, LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	readonly title_confirm = 'Confirm your personal information';
	readonly title_view = 'View your personal information';
	readonly subtitle_auth_new =
		'This information is from your BC Services Card. If you need to make any updates, please <a href="https://www.icbc.com/driver-licensing/getting-licensed/Pages/Change-your-address-or-name.aspx"  target="_blank">visit ICBC</a>.';
	readonly subtitle_unauth_renew_update = 'Update any information that has changed since your last application';

	maxBirthDate = this.utilService.getBirthDateMax();
	isLoggedIn = false;

	title = '';
	subtitle = '';

	authenticationSubscription!: Subscription;
	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
				if (isLoggedIn) {
					this.title = this.title_confirm;
					this.subtitle = this.subtitle_auth_new;

					this.surname.disable({ emitEvent: false });
					this.givenName.disable({ emitEvent: false });
					this.middleName1.disable({ emitEvent: false });
					this.middleName2.disable({ emitEvent: false });
					this.dateOfBirth.disable({ emitEvent: false });
				} else {
					this.title = this.title_confirm;
					this.subtitle = '';

					this.surname.enable();
					this.givenName.enable();
					this.middleName1.enable();
					this.middleName2.enable();
					this.dateOfBirth.enable();
				}
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get fullname(): string {
		return this.utilService.getFullNameWithMiddle(
			this.givenName?.value,
			this.middleName1?.value,
			this.middleName2?.value,
			this.surname?.value
		);
	}

	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}

	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}

	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}

	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}

	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
}
