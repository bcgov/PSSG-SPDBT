import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
    selector: 'app-contact-information',
    template: `
		<section class="step-section p-4">
		  <div class="step">
		    <app-step-title title="Provide your work contact information"></app-step-title>
		    <form [formGroup]="form" novalidate>
		      <div class="row">
		        <div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
		          <mat-form-field>
		            <mat-label>Given Name</mat-label>
		            <input matInput formControlName="contactGivenName" [errorStateMatcher]="matcher" maxlength="40" />
		            @if (form.get('contactGivenName')?.hasError('required')) {
		              <mat-error>This is required</mat-error>
		            }
		          </mat-form-field>
		        </div>
		        <div class="col-lg-4 col-md-6 col-sm-12">
		          <mat-form-field>
		            <mat-label>Surname</mat-label>
		            <input matInput formControlName="contactSurname" [errorStateMatcher]="matcher" maxlength="40" />
		            @if (form.get('contactSurname')?.hasError('required')) {
		              <mat-error>This is required</mat-error>
		            }
		          </mat-form-field>
		        </div>
		      </div>
		      <div class="row">
		        <div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
		          <mat-form-field>
		            <mat-label>Job Title</mat-label>
		            <input matInput formControlName="contactJobTitle" [errorStateMatcher]="matcher" maxlength="100" />
		            @if (form.get('contactJobTitle')?.hasError('required')) {
		              <mat-error>This is required</mat-error>
		            }
		          </mat-form-field>
		        </div>
		        <div class="col-lg-4 col-md-6 col-sm-12">
		          <mat-form-field>
		            <mat-label>Your Work Email Address</mat-label>
		            <input
		              matInput
		              formControlName="contactEmail"
		              placeholder="name@domain.com"
		              [errorStateMatcher]="matcher"
		              maxlength="75"
		              />
		              @if (form.get('contactEmail')?.hasError('required')) {
		                <mat-error>This is required</mat-error>
		              }
		              @if (form.get('contactEmail')?.hasError('email')) {
		                <mat-error>
		                  Must be a valid email address
		                </mat-error>
		              }
		            </mat-form-field>
		          </div>
		        </div>
		        <div class="row">
		          <div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
		            <mat-form-field>
		              <mat-label>Direct Phone Number</mat-label>
		              <input
		                matInput
		                formControlName="contactPhoneNumber"
		                [mask]="phoneMask"
		                [showMaskTyped]="false"
		                [errorStateMatcher]="matcher"
		                />
		                @if (form.get('contactPhoneNumber')?.hasError('required')) {
		                  <mat-error>This is required</mat-error>
		                }
		                @if (form.get('contactPhoneNumber')?.hasError('mask')) {
		                  <mat-error>This must be 10 digits</mat-error>
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
export class ContactInformationComponent implements RegistrationFormStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form: FormGroup = this.formBuilder.group({
		contactGivenName: new FormControl('', [FormControlValidators.required]),
		contactSurname: new FormControl('', [FormControlValidators.required]),
		contactJobTitle: new FormControl('', [FormControlValidators.required]),
		contactEmail: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
	});
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private maskPipe: NgxMaskPipe) {}

	getDataToSave(): any {
		const data = this.form.value;
		data.contactPhoneNumber = this.maskPipe.transform(data.contactPhoneNumber, SPD_CONSTANTS.phone.backendMask);
		return data;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
