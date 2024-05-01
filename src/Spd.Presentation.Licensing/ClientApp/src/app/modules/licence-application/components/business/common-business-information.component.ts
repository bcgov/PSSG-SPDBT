import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BusinessTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessLicenceTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-business-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-md-12 col-sm-12">
					<div class="row">
						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Legal Business Name</mat-label>
								<input matInput formControlName="legalBusinessName" />
							</mat-form-field>

							<div class="mb-4" style="color: var(--color-primary);" *ngIf="isBusinessLicenceSoleProprietor">
								<mat-icon style="vertical-align: bottom;">label_important</mat-icon> The name of your business must be
								your name, as it appears on your security worker licence
							</div>
						</div>

						<div class="col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label
									>Trade or 'Doing Business As' Name
									<mat-icon matTooltip="This is the name commonly used to refer to your business">info</mat-icon>
								</mat-label>
								<input matInput formControlName="doingBusinessAsName" />
							</mat-form-field>
						</div>

						<div class="col-lg-6 col-md-12">
							<app-alert type="info" icon="" [showBorder]="false">
								If you are unsure of your business type, check your
								<a class="large" href="https://www.account.bcregistry.gov.bc.ca/decide-business" target="_blank"
									>BC Registries account</a
								>.
							</app-alert>
							<mat-form-field>
								<mat-label>Business Type</mat-label>
								<mat-select formControlName="businessTypeCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let item of businessTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('businessTypeCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>

					<div *ngIf="isBusinessLicenceSoleProprietor" @showHideTriggerSlideAnimation>
						<mat-divider class="mat-divider-main mt-3"></mat-divider>
						<div class="text-minor-heading py-2">Sole Proprietors</div>
						<div class="pb-3">Sole proprietors must have a valid security worker licence</div>
						<div class="row">
							<div class="col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Lookup a Licence Number</mat-label>
									<input
										matInput
										type="search"
										formControlName="licenceNumberLookup"
										oninput="this.value = this.value.toUpperCase()"
										maxlength="10"
									/>
									<mat-error *ngIf="form.get('licenceNumberLookup')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>

							<div class="col-md-6 col-sm-12">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onSearch()">Search</button>
							</div>

							<div class="col-md-6 col-sm-12">
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

							<div class="col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Phone Number</mat-label>
									<input matInput formControlName="phoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
								</mat-form-field>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonBusinessInformationComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	businessTypes = BusinessLicenceTypes;

	@Input() form!: FormGroup;

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		return this.form.valid;
	}

	onSearch(): void {
		// TODO perform search
	}

	get isBusinessLicenceSoleProprietor(): boolean {
		return (
			this.businessTypeCode.value === BusinessTypeCode.NonRegisteredSoleProprietor ||
			this.businessTypeCode.value === BusinessTypeCode.RegisteredSoleProprietor
		);
	}
	get businessTypeCode(): FormControl {
		return this.form.get('businessTypeCode') as FormControl;
	}
}
