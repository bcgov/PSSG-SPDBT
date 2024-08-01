import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-business-licence-manager-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="summary-heading mb-2">Business Manager Information</div>
					<app-common-business-manager
						[form]="businessManagerFormGroup"
						[isReadonly]="true"
					></app-common-business-manager>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-divider class="mt-2 mb-3 mat-divider-primary"></mat-divider>
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-checkbox formControlName="isBusinessManager"> I am the business manager </mat-checkbox>
							</div>
						</div>

						<ng-container *ngIf="isBusinessManager.value !== true">
							<div class="summary-heading my-2">Your Information</div>
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Given Name</mat-label>
										<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
										<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
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
										<mat-label>Email Address</mat-label>
										<input
											matInput
											formControlName="emailAddress"
											[errorStateMatcher]="matcher"
											placeholder="name@domain.com"
											maxlength="75"
										/>
										<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
											Must be a valid email address
										</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Phone Number</mat-label>
										<input
											matInput
											formControlName="phoneNumber"
											[errorStateMatcher]="matcher"
											maxlength="30"
											appPhoneNumberTransform
										/>
										<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>
						</ng-container>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceManagerInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	title = '';
	subtitle =
		"We require contact information for your company's business manager, who is responsible for the day-to-day supervision of licensed security workers";

	readonly title_new = 'Provide contact information';
	readonly title_renew_update = 'Confirm contact information';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	businessManagerFormGroup = this.businessApplicationService.businessManagerFormGroup;
	form = this.businessApplicationService.applicantFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = this.title_new;
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				this.title = this.title_renew_update;
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isBusinessManager(): FormControl {
		return this.form.get('isBusinessManager') as FormControl;
	}
}
