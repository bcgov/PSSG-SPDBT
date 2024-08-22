import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-contact-information',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Confirm your information"
						subtitle="Legal name must match your government-issued identification"
					></app-step-title>
					<div class="row">
						<div class="offset-lg-1 col-lg-3 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label
									>Legal Given Name
									<span class="optional-label" *ngIf="isGivenNameOptional">(optional)</span></mat-label
								>
								<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								<mat-error *ngIf="form.get('givenName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName1" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName2" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-1 col-lg-3 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Legal Surname</mat-label>
								<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								<mat-error *ngIf="!isGivenNameOptional && form.get('surname')?.hasError('required')">
									This is required
								</mat-error>
								<mat-error *ngIf="isGivenNameOptional && form.get('surname')?.hasError('required')">
									Use this field if you have only one name
								</mat-error>
							</mat-form-field>
							<div class="w-100 mb-4" *ngIf="!orgData?.readonlyTombstone">
								<mat-checkbox formControlName="oneLegalName" (click)="onOneLegalNameChange()">
									I have only a given name OR a surname
								</mat-checkbox>
							</div>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Email</mat-label>
								<input
									matInput
									formControlName="emailAddress"
									placeholder="name@domain.com"
									[errorStateMatcher]="matcher"
									maxlength="75"
								/>
								<mat-error *ngIf="form.get('emailAddress')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
									Must be a valid email address
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="phoneNumber"
									[errorStateMatcher]="matcher"
									[mask]="phoneMask"
									[showMaskTyped]="false"
								/>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class SaContactInformationComponent implements CrcFormStepComponent {
	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;

		const readonlyTombstone = data.readonlyTombstone ?? false;
		if (readonlyTombstone) {
			// SPDBT-2948 - do not enforce name validation when it is prepopulated
			this.form = this.formBuilder.group({
				givenName: new FormControl({ value: data.givenName, disabled: true }),
				middleName1: new FormControl({ value: data.middleName1, disabled: true }),
				middleName2: new FormControl({ value: data.middleName2, disabled: true }),
				surname: new FormControl({ value: data.surname, disabled: true }),
				emailAddress: new FormControl(data.emailAddress, [Validators.required, FormControlValidators.email]),
				phoneNumber: new FormControl(data.phoneNumber, [Validators.required]),
				oneLegalName: new FormControl(data.oneLegalName),
			});
		} else {
			this.form = this.formBuilder.group(
				{
					givenName: new FormControl({ value: data.givenName, disabled: false }, [FormControlValidators.required]),
					middleName1: new FormControl({ value: data.middleName1, disabled: false }),
					middleName2: new FormControl({ value: data.middleName2, disabled: false }),
					surname: new FormControl({ value: data.surname, disabled: false }, [FormControlValidators.required]),
					emailAddress: new FormControl(data.emailAddress, [Validators.required, FormControlValidators.email]),
					phoneNumber: new FormControl(data.phoneNumber, [Validators.required]),
					oneLegalName: new FormControl(data.oneLegalName),
				},
				{
					validators: [
						FormGroupValidators.conditionalRequiredValidator(
							'givenName',
							(form) => form.get('oneLegalName')?.value != true
						),
					],
				}
			);
		}
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	isGivenNameOptional = false;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private maskPipe: NgxMaskPipe) {}

	getDataToSave(): any {
		const data = { ...this.form.value };
		data.phoneNumber = this.maskPipe.transform(data.phoneNumber, SPD_CONSTANTS.phone.backendMask);
		return data;
	}

	onOneLegalNameChange(): void {
		this.isGivenNameOptional = this.oneLegalName.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	get oneLegalName(): FormControl {
		return this.form.get('oneLegalName') as FormControl;
	}
}
