import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderTypes, SwlStatusTypeCode } from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-personal-information',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Given Name</mat-label>
										<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName1" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName2" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Surname</mat-label>
										<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
										<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-4 col-lg-6 col-md-12">
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
										<mat-datepicker #picker startView="multi-year" [startAt]="startAtBirthDate"></mat-datepicker>
										<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12">
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
		</section>
	`,
	styles: [],
})
export class PersonalInformationComponent implements OnInit, LicenceFormStepComponent {
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	readonly title_confirm = 'Confirm your personal information';
	readonly title_view = 'View your personal information';
	readonly subtitle_auth_new =
		'This information is from your BC Services Card. If you need to make any updates, please <a href="https://www.icbc.com/driver-licensing/getting-licensed/Pages/Change-your-address-or-name.aspx"  target="_blank">visit ICBC</a>.';
	readonly subtitle_unauth_renew_update = 'Update any information that has changed since your last application';

	startAtBirthDate = this.utilService.getBirthDateStartAt();
	maxBirthDate = this.utilService.getBirthDateMax();

	title = '';
	subtitle = '';

	form: FormGroup = this.formBuilder.group({
		givenName: new FormControl(null),
		middleName1: new FormControl(null),
		middleName2: new FormControl(null),
		surname: new FormControl(null, [FormControlValidators.required]),
		genderCode: new FormControl(null, [FormControlValidators.required]),
		dateOfBirth: new FormControl(null, [Validators.required]),
	});

	constructor(
		private formBuilder: FormBuilder,
		private utilService: UtilService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					if (this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Replacement) {
						this.title = this.title_view;
						this.subtitle = '';
					} else {
						this.title = this.title_confirm;
						this.subtitle =
							this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.NewOrExpired
								? this.subtitle_auth_new
								: this.subtitle_unauth_renew_update;
					}

					this.form.patchValue({
						givenName: this.licenceApplicationService.licenceModel.givenName,
						middleName1: this.licenceApplicationService.licenceModel.middleName1,
						middleName2: this.licenceApplicationService.licenceModel.middleName2,
						surname: this.licenceApplicationService.licenceModel.surname,
						genderCode: this.licenceApplicationService.licenceModel.genderCode,
						dateOfBirth: this.licenceApplicationService.licenceModel.dateOfBirth,
					});

					if (this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Replacement) {
						this.form.disable();
					} else {
						this.form.enable();
					}
				}
			},
		});
	}

	isFormValid(): boolean {
		if (this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Replacement) {
			return true;
		}

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}
}
