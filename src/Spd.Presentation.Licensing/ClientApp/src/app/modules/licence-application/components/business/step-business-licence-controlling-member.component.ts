import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-controlling-member',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Add all controlling members of this business"
					subtitle="<a class='large' href='https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/rules'>Controlling members</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence"
				></app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
						<app-alert type="warning" icon="warning">
							Controlling members who are not licensed security workers must consent to criminal, police information and
							correctional service record checks. These checks help the Registrar determine whether or not to approve
							your security business application.
						</app-alert>
					</div>
				</div>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasBranchesInBc">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasBranchesInBc')?.dirty || form.get('hasBranchesInBc')?.touched) &&
									form.get('hasBranchesInBc')?.invalid &&
									form.get('hasBranchesInBc')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasBranchesInBc.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="col-xxl-8 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Branches in B.C.</div>
							<!-- <ng-container formArrayName="branches" *ngFor="let group of branchesArray.controls; let i = index">
								<div class="row" [formGroupName]="i">
									<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
											<input matInput type="text" formControlName="givenName" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
											<input matInput type="text" formControlName="middleName1" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
											<input matInput type="text" formControlName="middleName2" maxlength="40" />
										</mat-form-field>
									</div>
									<div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
										<mat-form-field [ngClass]="moreThanOneRowExists ? 'more-than-one-row' : ''">
											<mat-label>Surname</mat-label>
											<input
												matInput
												type="text"
												formControlName="surname"
												required
												[errorStateMatcher]="matcher"
												maxlength="40"
											/>
											<mat-error *ngIf="group.get('surname')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
										<button
											mat-mini-fab
											class="delete-row-button ms-1 mb-3"
											matTooltip="Remove previous name"
											(click)="onDeleteRow(i)"
											*ngIf="moreThanOneRowExists"
											aria-label="Remove row"
										>
											<mat-icon>delete_outline</mat-icon>
										</button>
									</div>
								</div>
							</ng-container>
							<div class="row mb-2">
								<div class="col-12">
									<button mat-stroked-button (click)="onAddRow()" class="w-auto">
										<mat-icon class="add-icon">add_circle</mat-icon>Add Another Branch
									</button>
								</div>
							</div> -->
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceControllingMemberComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.businessApplicationService.branchesInBcFormGroup;

	constructor(private formBuilder: FormBuilder, private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	get hasBranchesInBc(): FormControl {
		return this.form.get('hasBranchesInBc') as FormControl;
	}
	get branchesArray(): FormArray {
		return <FormArray>this.form.get('branches');
	}
}
