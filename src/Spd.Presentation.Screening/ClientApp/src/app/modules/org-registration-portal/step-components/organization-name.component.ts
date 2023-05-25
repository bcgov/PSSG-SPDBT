import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-organization-name',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<app-step-title title="Provide us with more organization information"></app-step-title>
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
							<mat-error *ngIf="form.get('organizationName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class OrganizationNameComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			organizationName: new FormControl('', [Validators.required]),
		});

		this.authenticationService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			const currOrgName = this.organizationName.value;
			if (!currOrgName && isLoggedIn) {
				const loggedInOrgName = this.authenticationService.loggedInUserInfo?.orgName;
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
