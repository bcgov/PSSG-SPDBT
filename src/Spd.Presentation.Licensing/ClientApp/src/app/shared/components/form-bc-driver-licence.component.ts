import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';

@Component({
	selector: 'app-form-bc-driver-licence',
	template: `
		<form [formGroup]="form" novalidate>
		  <div class="row">
		    <div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
		      <mat-radio-group aria-label="Select an option" formControlName="hasBcDriversLicence">
		        <mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
		        <mat-divider class="my-2"></mat-divider>
		        <mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
		      </mat-radio-group>
		      @if (
		        (form.get('hasBcDriversLicence')?.dirty || form.get('hasBcDriversLicence')?.touched) &&
		        form.get('hasBcDriversLicence')?.invalid &&
		        form.get('hasBcDriversLicence')?.hasError('required')
		        ) {
		        <mat-error
		          class="mat-option-error"
		          >This is required</mat-error
		          >
		        }
		      </div>
		    </div>
		
		    @if (hasBcDriversLicence.value === booleanTypeCodes.Yes) {
		      <div class="row mt-4" @showHideTriggerSlideAnimation>
		        <div class="col-md-8 col-sm-12 mx-auto">
		          <mat-divider class="mb-3 mat-divider-primary"></mat-divider>
		          <div class="row mt-2">
		            <div class="col-lg-6 col-md-12 col-sm-12 mx-auto">
		              <div class="text-minor-heading mb-2">Your BC Driver's Licence</div>
		              <mat-form-field>
		                <mat-label>BC Driver's Licence <span class="optional-label">(recommended)</span></mat-label>
		                <input matInput formControlName="bcDriversLicenceNumber" mask="00000009" />
		                @if (form.get('bcDriversLicenceNumber')?.hasError('mask')) {
		                  <mat-error>
		                    This must be 7 or 8 digits
		                  </mat-error>
		                }
		              </mat-form-field>
		            </div>
		          </div>
		        </div>
		      </div>
		    }
		  </form>
		`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class FormBcDriverLicenceComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;

	get hasBcDriversLicence(): FormControl {
		return this.form.get('hasBcDriversLicence') as FormControl;
	}
}
