import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
    selector: 'app-compensation-question',
    template: `
		<section class="step-section p-4">
		  <div class="step">
		    <app-step-title
		      title="Do volunteers with your organization get any money for volunteering?"
		      subtitle="This includes honorarium payments. It does not include gifts, gift cards, or meals."
		    ></app-step-title>
		    <form [formGroup]="form" novalidate>
		      <div class="row">
		        <div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
		          <mat-radio-group aria-label="Select an option" formControlName="employeeMonetaryCompensationFlag">
		            <mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
		            <mat-divider class="my-3"></mat-divider>
		            <mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
		          </mat-radio-group>
		          @if (
		            (form.get('employeeMonetaryCompensationFlag')?.dirty ||
		            form.get('employeeMonetaryCompensationFlag')?.touched) &&
		            form.get('employeeMonetaryCompensationFlag')?.invalid &&
		            form.get('employeeMonetaryCompensationFlag')?.hasError('required')
		            ) {
		            <mat-error
		              class="mat-option-error"
		              >An option must be selected</mat-error
		              >
		            }
		          </div>
		        </div>
		      </form>
		    </div>
		  </section>
		`,
    styles: [],
    standalone: false
})
export class CompensationQuestionComponent implements RegistrationFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		employeeMonetaryCompensationFlag: new FormControl('', [FormControlValidators.required]),
	});

	booleanTypeCodes = BooleanTypeCode;

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
