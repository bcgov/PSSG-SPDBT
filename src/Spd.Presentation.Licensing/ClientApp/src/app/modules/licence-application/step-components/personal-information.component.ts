import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-personal-information',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<div class="row">
									<!-- <div class="w-100">
									<mat-checkbox formControlName="oneLegalName"> I have one legal name </mat-checkbox>
								</div> -->
									<ng-container *ngIf="isLoggedIn; else NotLoggedIn">
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName1" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName2" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Surname</mat-label>
												<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
												<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Date of Birth</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="dateOfBirth"
													[max]="maxBirthDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
											</mat-form-field>
										</div>
									</ng-container>

									<ng-template #NotLoggedIn>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName1" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
												<input matInput formControlName="middleName2" maxlength="40" />
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Surname</mat-label>
												<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
												<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
											</mat-form-field>
										</div>
										<div class="col-xl-6 col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Date of Birth</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="dateOfBirth"
													[max]="maxBirthDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
											</mat-form-field>
										</div>
									</ng-template>

									<div class="col-xl-6 col-lg-6 col-md-12">
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
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class PersonalInformationComponent implements OnInit, OnDestroy, LicenceChildStepperStepComponent {
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
