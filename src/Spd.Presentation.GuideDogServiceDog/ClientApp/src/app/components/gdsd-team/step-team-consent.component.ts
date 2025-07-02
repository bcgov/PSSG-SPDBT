import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-team-consent',
	template: `
		<app-step-section heading="Acknowledgement">
		  <form [formGroup]="form" novalidate>
		    <div class="row">
		      <div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
		        <div class="row">
		          <div class="col-12 py-3 hereby">
		            I certify that the information I have provided is true and correct to the best of my knowledge and
		            belief. I understand that inaccurate, misleading, missing or false information may lead to refusal or
		            cancellation of my guide or service dog team certificate. I agree to adhere to any terms and conditions
		            of certification.
		            @if (!isTrainedByAccreditedSchools) {
		              <span>
		                I agree to the release of the information provided in this application to the approved assessment
		                organization that will administer the BC guide dog and service dog assessment for me and my guide or
		                service dog.</span
		                >
		              }
		            </div>
		          </div>
		
		          <div class="col-xl-6 col-lg-6 col-md-12 mt-4">
		            <mat-form-field>
		              <mat-label>Name of Applicant or Legal Guardian</mat-label>
		              <input
		                matInput
		                formControlName="applicantOrLegalGuardianName"
		                maxlength="80"
		                [errorStateMatcher]="matcher"
		                />
		                @if (form.get('applicantOrLegalGuardianName')?.hasError('required')) {
		                  <mat-error>
		                    This is required
		                  </mat-error>
		                }
		              </mat-form-field>
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
		
		            @if (displayCaptcha.value) {
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
		            }
		
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
export class StepTeamConsentComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdTeamApplicationService.consentAndDeclarationFormGroup;

	@Input() isTrainedByAccreditedSchools!: boolean;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.captchaFormGroup.patchValue({ displayCaptcha: !isLoggedIn });
		});
	}

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
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
