import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-consent',
	template: `
		<app-step-section heading="Acknowledgement">
		  <form [formGroup]="form" novalidate>
		    <div class="row">
		      <div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
		        <div class="row">
		          <div class="col-12 py-3 hereby">
		            I certify that the dog trainer identified in this application trains dogs on behalf of this accredited
		            or recognized training school for the purpose of the dogs becoming guide dogs or service dogs. I
		            understand that inaccurate, misleading, missing or false information may lead to refusal or cancellation
		            of the dog trainer certificate. On behalf of this accredited or recognized training school and the dog
		            trainer, I agree to adhere to any terms and conditions of certification.
		          </div>
		        </div>
		
		        <div class="row">
		          <div class="col-12 mt-3">
		            <mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
		              Declaration & Sign Off
		            </mat-checkbox>
		            @if (
		              (form.get('agreeToCompleteAndAccurate')?.dirty ||
		              form.get('agreeToCompleteAndAccurate')?.touched) &&
		              form.get('agreeToCompleteAndAccurate')?.invalid &&
		              form.get('agreeToCompleteAndAccurate')?.hasError('required')
		              ) {
		              <mat-error
		                class="mat-option-error"
		                >
		                This is required
		              </mat-error>
		            }
		          </div>
		        </div>
		
		        <div class="row mt-4">
		          <div class="col-12">
		            <mat-form-field class="w-auto">
		              <mat-label>Date Signed</mat-label>
		              <input matInput formControlName="dateSigned" />
		              @if (form.get('dateSigned')?.hasError('required')) {
		                <mat-error>This is required</mat-error>
		              }
		            </mat-form-field>
		          </div>
		        </div>
		
		        <div class="row mb-4">
		          <div class="col-12">
		            <div formGroupName="captchaFormGroup">
		              <app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
		              @if (
		                (captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
		                captchaFormGroup.get('token')?.invalid &&
		                captchaFormGroup.get('token')?.hasError('required')
		                ) {
		                <mat-error
		                  class="mat-option-error"
		                  >This is required
		                </mat-error>
		              }
		            </div>
		          </div>
		        </div>
		
		        <app-form-gdsd-collection-notice></app-form-gdsd-collection-notice>
		      </div>
		    </div>
		  </form>
		</app-step-section>
		`,
	styles: [
		`
			.hereby {
				background-color: #f6f6f6 !important;
			}
		`,
	],
	standalone: false,
})
export class StepDtConsentComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.dogTrainerApplicationService.consentAndDeclarationDtFormGroup;

	constructor(
		private utilService: UtilService,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.agreeToCompleteAndAccurate) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
