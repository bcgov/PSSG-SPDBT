import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
    selector: 'app-organization-name',
    template: `
		<section class="step-section p-4">
		  <div class="step">
		    <app-step-title title="Provide us with more organization information"></app-step-title>
		    <form [formGroup]="form" novalidate>
		      <div class="row">
		        <div class="offset-lg-3 col-lg-6 offset-md-1 col-md-10 col-sm-12">
		          <mat-form-field>
		            <mat-label>Organization Name</mat-label>
		            <input
		              matInput
		              formControlName="organizationName"
		              required
		              [errorStateMatcher]="matcher"
		              maxlength="160"
		              />
		              <mat-hint>Please enter your 'Doing Business As' name</mat-hint>
		              @if (form.get('organizationName')?.hasError('required')) {
		                <mat-error>This is required</mat-error>
		              }
		            </mat-form-field>
		          </div>
		        </div>
		      </form>
		    </div>
		  </section>
		`,
    styles: [],
    standalone: false
})
export class OrganizationNameComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private authProcessService: AuthProcessService) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			organizationName: new FormControl('', [FormControlValidators.required]),
		});

		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			const currOrgName = this.organizationName.value;
			if (!currOrgName && isLoggedIn) {
				const loggedInOrgName = this.authProcessService.loggedInUserTokenData.bceid_business_name;
				if (loggedInOrgName) {
					this.form.patchValue({ organizationName: loggedInOrgName });
				}
			}
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}

	get organizationName(): FormControl {
		return this.form.get('organizationName') as FormControl;
	}
}
