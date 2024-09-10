import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-consent-and-declaration',
	template: `
		<app-step-section title="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="conditions px-3 mb-3">
								<div class="text-minor-heading my-2">
									ON BEHALF OF the applicant business entity, I hereby acknowledge that:
								</div>
								<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update; else newOrRenewal">
									<div class="my-3">
										<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
											I AM AUTHORIZED to sign this update form on behalf of the business entity.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check1')?.dirty || form.get('check1')?.touched) &&
												form.get('check1')?.invalid &&
												form.get('check1')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
								</ng-container>

								<ng-template #newOrRenewal>
									<div class="my-3">
										<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
											The Security Business Licence will be kept continuously on display in a visible place accessible
											to the public in every office in which I am permitted, under the licence, to carry on the security
											business.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check1')?.dirty || form.get('check1')?.touched) &&
												form.get('check1')?.invalid &&
												form.get('check1')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
											Within 20 days of submitting this application, and in accordance with section 4(3)(d) of the
											<i>Security Services Regulation</i>, I will provide the Registrar with drawings or photos of any
											uniforms, insignia, logos, vehicle markings used or to be used by the applicant business entity.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check2')?.dirty || form.get('check2')?.touched) &&
												form.get('check2')?.invalid &&
												form.get('check2')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
											I will report the following to the Registrar within 14 days of the occurrence:
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check3')?.dirty || form.get('check3')?.touched) &&
												form.get('check3')?.invalid &&
												form.get('check3')?.hasError('required')
											"
											>This is required
										</mat-error>

										<ul class="primary-text-data ms-5 my-0">
											<li>any change in the security business licensee’s residential or security business address;</li>
											<li>
												any change in the ownership or management of the security business, including without limitation
												the addition of any individual who has control or the ability to control the security business
												and its operations (Controlling Member)
											</li>
											<li>a criminal charge laid against the security business licensee or any Controlling Member</li>
											<li>a criminal conviction against the security business licensee or any Controlling Member</li>
											<li>
												a criminal charge laid or criminal conviction against any individual employed or engaged by the
												security business licensee for security work.
											</li>
										</ul>
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
											The security business licensee will be required to surrender the security business licence and all
											duplicates to the Registrar in the event that the business ceases operation or does not have an
											employee(s) that holds a valid security worker licence of a type that matches the security
											business licence type.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check4')?.dirty || form.get('check4')?.touched) &&
												form.get('check4')?.invalid &&
												form.get('check4')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check5" (click)="onCheckboxChange()">
											The security business’ licence information (legal business name, security licence number and
											licence status) is to be made publicly accessible through the Security Industry and Licensing
											website.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check5')?.dirty || form.get('check5')?.touched) &&
												form.get('check5')?.invalid &&
												form.get('check5')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check6" (click)="onCheckboxChange()">
											I AM AUTHORIZED to sign this update form on behalf of the business entity.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('check6')?.dirty || form.get('check6')?.touched) &&
												form.get('check6')?.invalid &&
												form.get('check6')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
								</ng-template>
							</div>
						</div>

						<div class="row">
							<div class="col-12">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									<ng-container
										*ngIf="applicationTypeCode === applicationTypeCodes.Update; else newOrRenewalCertifyText"
									>
										I HEREBY CERTIFY THAT I have read and understand all portions of this update form and the
										information set out by me herein is true and correct to the best of my knowledge and belief. I have
										read and understand the <i>Security Services Act</i> and Regulations; and I confirm that I am aware
										of, understand and remain bound by the conditions attached to the security business licence as well
										as those placed on the security business licensee.
									</ng-container>
									<ng-template #newOrRenewalCertifyText>
										I HEREBY CERTIFY THAT I have read and understand all portions of this application form and
										information set out by me in this application is true and correct to the best of my knowledge and
										belief. I have read and understood the <i>Security Services Act</i> and Regulations; and I am aware
										of and understand the conditions attached the security business licence as well as those placed on
										the security business licensee.
									</ng-template>
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('agreeToCompleteAndAccurate')?.dirty ||
											form.get('agreeToCompleteAndAccurate')?.touched) &&
										form.get('agreeToCompleteAndAccurate')?.invalid &&
										form.get('agreeToCompleteAndAccurate')?.hasError('required')
									"
									>This is required
								</mat-error>
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12">
								<mat-form-field class="w-auto">
									<mat-label>Date Signed</mat-label>
									<input matInput formControlName="dateSigned" />
									<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="col-12">
								<app-collection-notice></app-collection-notice>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceConsentAndDeclarationComponent implements OnInit, LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.businessApplicationService.consentAndDeclarationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private utilService: UtilService, private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			// these checkboxes are not displayed in the update process
			this.form.patchValue({
				check2: true,
				check3: true,
				check4: true,
				check5: true,
				check6: true,
			});
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (
			data.agreeToCompleteAndAccurate &&
			data.check1 &&
			data.check2 &&
			data.check3 &&
			data.check4 &&
			data.check5 &&
			data.check6
		) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}
}
