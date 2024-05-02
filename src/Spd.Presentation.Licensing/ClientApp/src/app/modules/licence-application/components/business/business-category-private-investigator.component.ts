import { Component } from '@angular/core';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-business-category-private-investigator',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fs-5 lh-base my-3">
						To qualify for a private investigator business licence, you must have a manager with a valid security worker
						licence
					</div>

					<div class="row">
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
								<mat-label>Manager's Security Worker Licence Number</mat-label>
								<input
									matInput
									type="search"
									formControlName="managerLicenceNumber"
									oninput="this.value = this.value.toUpperCase()"
									[errorStateMatcher]="matcher"
									maxlength="10"
								/>
								<mat-error *ngIf="form.get('managerLicenceNumber')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: ``,
})
export class BusinessCategoryPrivateInvestigatorComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categoryPrivateInvestigatorFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return true; // TODO return this.form.valid;
	}
}
