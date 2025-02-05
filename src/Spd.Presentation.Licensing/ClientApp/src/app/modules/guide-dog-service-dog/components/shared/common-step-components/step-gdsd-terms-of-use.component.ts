import { Component, Input } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-terms-of-use',
	template: `
		<app-step-section title="Terms and Conditions" subtitle="Read, download, and accept the Terms of Use to continue">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="offset-xxl-1 col-xxl-10 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<div class="conditions px-3 mb-3" (scroll)="onScrollTermsAndConditions($event)">
							<div class="fs-5 mt-2 mb-3">
								IGNORE THIS TEXT - NEED TO UPDATE
								<!-- Terms of Use for Submitting an Update to or Requesting a Replacement of a Security Worker Licence or
								Permit Application Online, including Related Prescribed Checks -->
							</div>
							<p>
								In these Terms of Use, "you" or "your" includes the individual using or accessing the Electronic
								Security Services Portal (the "Site") on their own behalf to submit an update to, or request a
								replacement of, a security worker licence, armoured vehicle permit, or body armour permit. Depending on
								the nature of the submitted update to your licence or permit, the British Columbia Registrar of Security
								Services (Registrar) may decide to carry out a criminal record check, police information check and a
								correctional service information check on you (Prescribed Checks). You provided your authorization for
								the Registrar to carry out Prescribed Checks at the time of applying for or renewing your licence or
								permit, with your authorization to remain in place for the duration of your licence or permit term.
								Accordingly, the Registrar will not seek a new authorization to carry out Prescribed Checks from you at
								this time. These Terms of Use apply to the online update process for your licence or permit, including
								as applicable your submission to Prescribed Checks administered by the Registrar.
							</p>
							<p>
								These Terms of Use are an agreement between you and His Majesty the King in Right of the Province of
								British Columbia, represented by the Minister of Public Safety and Solicitor General (the "Province")
								and they govern your use of the Site and, where applicable, any associated service ("Associated Service"
								and, together with the Site, the "Services"). By clicking the box to indicate that you accept these
								Terms of Use, and in consideration of your use of the Services, you agree, to the terms and conditions
								set out below.
							</p>
							<p>
								Your failure to abide by these Terms of Use may result in the suspension or cancellation of your use of
								or access to the Services. In addition, the Province reserves the right to pursue any remedy available
								at law or in equity.
							</p>
							<p class="fw-bold">Please print a copy of these Terms of Use for your records.</p>

							<ol>
								<div class="fs-5 terms-subtitle">Disclaimer:</div>
								<li>
									Reasonable efforts have been made to provide accurate, complete and timely information regarding the
									Services and the Site in general. However, you are encouraged to refer to the
									<i>Security Services Act</i>, <i>Body Armour Control Act</i>, or
									<i>Armoured Vehicle and After Market Compartment Control Act</i>, as applicable, and any related
									Regulations and other official information materials before submitting an online update to, or
									requesting a replacement of, a security licence or permit described above, including Prescribed
									Checks, where applicable.
								</li>
								<li>
									THE SERVICES ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND INCLUDING WARRANTY OF FITNESS FOR A
									PARTICULAR PURPOSE. USE OF THE SERVICES IS ENTIRELY AT YOUR OWN RISK AND YOU WILL BE LIABLE FOR ANY
									FAILURE TO ABIDE BY THESE TERMS OF USE.
								</li>
								<li>
									WITHOUT LIMITING THE GENERAL NATURE OF THE FOREGOING, THE PROVINCE DOES NOT REPRESENT OR WARRANT THAT:
									<ol type="a">
										<li>
											THE ACCURACY, COMPLETENESS OR CURRENCY OF SERVICES OR ANY ASSOCIATED INFORMATION, OR THAT ANY
											ERRORS WILL BE CORRECTED;
										</li>
										<li>
											THE SERVICES WILL FUNCTION IN A TIMELY MANNER OR WILL BE AVAILABLE WITHOUT ERROR, FAILURE OR
											INTERRUPTION; OR
										</li>
										<li>THE SERVICES WILL MEET YOUR EXPECTATIONS OR REQUIREMENTS.</li>
									</ol>
								</li>
								<li>The Province is not responsible for the content of the Payment Site as defined below.</li>
								<div class="fs-5 terms-subtitle">Information Collection:</div>
								<li>
									When you visit the Site or use the Services, certain types of information are automatically collected
									from you, through the use of audit logs or cookies. This information is collected, used and disclosed
									in accordance with the Province’s
									<a aria-label="Navigate to Privacy Policy site" [href]="bcGovPrivacyUrl" target="_blank"
										>Privacy Policy</a
									>.
								</li>
								<li>
									The date and time of your acceptance of these Terms of Use will be logged. This will enable you to
									skip this step on future visits. However, if these Terms of Use are modified, they will be presented
									to you upon your next following visit and you will need to accept the modified terms in order to
									continue to access the Services. Notwithstanding the foregoing, you are responsible for reviewing
									these Terms of Use on a regular basis to ensure that you are aware of any modifications that may have
									been made and your continued use of the Services constitutes your acceptance of any such modified
									Terms of Use.
								</li>
								<li>
									The information that you input on the Site may also be logged and attributed to you for verification
									purposes.
								</li>
								<li>
									Any personal information that may be collected from you on this Site is collected, used and disclosed
									in accordance with the collection notice presented to you at the time of collection.
								</li>
								<div class="fs-5 terms-subtitle">Authentication:</div>
								<li>
									You must be authenticated to submit an online update to, or request a replacement of, your security
									licence or permit, including submitting to Prescribed Checks, if applicable. Your identity will be
									verified through your BC Services Card account login, approved government-issued ID, or other approved
									authentication method as may be implemented from time to time, which at the time of an update to your
									licence or permit may require that you gain access to the Site by way of a unique access code provided
									to you.
								</li>
								<li>
									Your identity will be verified each time you access the Site, and depending on the authentication
									method used, you may be required to follow a link to an external site, including the
									<a aria-label="Navigate to BC Services Card site" [href]="bcServicesCardUrl" target="_blank"
										>BC Services Card Site</a
									>, following which you will be returned to, and allowed to access the application or update portions
									of, the Site.
								</li>
								<div class="fs-5 terms-subtitle">Payment:</div>
								<li>
									You may be required to access an external payment processing site (“Payment Site” or, as the context
									requires, “Associated Service”) in order to pay the required fee, if any, associated with the update
									to, or replacement of, your licence or permit.
								</li>
								<div class="fs-5 terms-subtitle">Additional Terms and Personal Information Collection:</div>
								<li>
									You may be required to accept additional terms and conditions in order to use or access an Associated
									Service, including the BC Services Card Site, and/or the Payment Site, in which case your access to,
									and use of the services offered by, those Associated Services or the Payment Site is governed by such
									additional terms.
								</li>
								<li>
									Additional personal information may be collected from you by the providers of the Associated Services
									in accordance with their terms and any associated privacy statement(s).
								</li>
								<div class="fs-5 terms-subtitle">Warranty:</div>
								<li>
									In accessing or using the Site, you represent and warrant that:
									<ol type="a">
										<li>You are at least 19 years of age; and</li>
										<li>You have the power and capacity to accept, execute and comply with these Terms of Use.</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Acceptable Use and Security:</div>
								<li>
									You must not:
									<ol type="a">
										<li>
											use the Services for any unlawful or inappropriate purpose, including hacking, data mining or
											other intrusion activities;
										</li>
										<li>
											input or upload any information which contains viruses, Trojan horses, worms, time bombs or other
											computer programming routines that may damage or interfere with the performance or function of the
											Services or any Associated Service;
										</li>
										<li>
											divulge, share, compromise or permit any other person to use your login and password to access the
											Services;
										</li>
										<li>
											take any action that might reasonably be construed as altering, destroying, defeating,
											compromising or rendering ineffective the security related to the Site or any Associated Service,
											or being likely to affect other users of the Services;
										</li>
										<li>attempt to collect any information about other users of the Services; or</li>
										<li>
											decompile, disassemble, reverse engineer or otherwise copy any source code associated with the
											Site or any Associated Service.
										</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Ownership and Non-permitted Uses:</div>
								<li>
									You acknowledge and agree that at all times the Province and/or the providers of the Associated
									Services, or their respective licensors are the owners of any software, hardware, servers, networks or
									other equipment used to provide the Services.
								</li>
								<li>
									You will not take any action that would be inconsistent with or infringe any proprietary or
									intellectual property rights of the Province, the providers of the Associated Services or their
									respective licensors, in any software, hardware, servers, networks or other equipment, documentation
									or other information used to provide the Services.
								</li>
								<li>
									You will not remove or alter any proprietary symbol or notice, including any copyright notice,
									trademark or logo displayed in connection with the Services.
								</li>
								<div class="fs-5 terms-subtitle">Suspension or Cancellation of Services:</div>
								<li>
									Your use of any of the Services may be suspended or cancelled at any time if:
									<ol>
										<li>
											you fail to abide by these Terms of Use, or other terms and conditions that may be posted on any
											website used to access the Services; or
										</li>
										<li>
											the Province or the provider of any Associated Service deems such suspension or cancellation
											necessary for any good and valid reason.
										</li>
									</ol>
								</li>
								<li>
									The Province and any provider of any Associated Service reserve the right, at any time, to:
									<ol>
										<li>make changes to the Services;</li>
										<li>stop providing the Services; and</li>
										<li>modify these Terms of Use at any time, without notice being provided directly to you.</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Limitation of Liability:</div>
								<li>
									In addition to the Province’s general
									<a aria-label="Navigate to Limitation of Liabilities site" [href]="bcGovDisclaimerUrl" target="_blank"
										>Limitation of Liabilities</a
									>, you agree that under no circumstances will the Province or the provider of any Associated Service
									be liable to you or to any other individual or entity for any direct, indirect, special, incidental,
									consequential or other loss, claim, injury or damage, whether foreseeable or unforeseeable (including
									without limitation claims for damages for loss of profits or business opportunities, use of or
									inability to use the Services, interruptions, deletion or corruption of files, loss of programs or
									information, errors, defects or delays) arising out of or in any way connected with your or their
									access to or use of the Services or any failure by you or them to abide by these Terms of Use and
									whether based on contract, tort, strict liability or any other legal theory. The previous sentence
									will apply even if the Province or the provider of any Associated Service has been specifically
									advised of the possibility of any such loss, claim, injury or damage.
								</li>
								<div class="fs-5 terms-subtitle">Enforceability and Jurisdiction:</div>
								<li>
									If any term or provision of these Terms of Use is invalid, illegal or unenforceable, all other terms
									and provisions of these Terms of Use will nonetheless remain in full force and effect.
								</li>
								<li>
									All access to the Site or use of any Services or Associated Service will be governed by, and construed
									and interpreted in accordance with, the laws applicable in the Province of British Columbia, Canada.
								</li>
								<li>
									You hereby consent to the exclusive jurisdiction and venue of the courts of the Province of British
									Columbia, sitting in Victoria, for the hearing of any matter relating to or arising from these Terms
									of Use and/or your access to the Site or use of the Services or any Associated Service.
								</li>
							</ol>
						</div>

						<ng-container *ngIf="displayValidationErrors && !hasScrolledToBottom">
							<div class="alert alert-danger" role="alert">
								Scroll to the bottom of the terms and conditions section to proceed
							</div>
						</ng-container>
					</div>
				</div>

				<div class="row my-2">
					<div class="offset-xxl-1 col-xxl-7 offset-xl-1 col-xl-6 col-lg-7 col-md-12 col-sm-12 mb-2">
						<mat-checkbox formControlName="agreeToTermsAndConditions" (click)="onCheckboxChange()">
							I have read and accept the above Terms of Use.
						</mat-checkbox>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('agreeToTermsAndConditions')?.dirty || form.get('agreeToTermsAndConditions')?.touched) &&
								form.get('agreeToTermsAndConditions')?.invalid &&
								form.get('agreeToTermsAndConditions')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-12 col-sm-12 mb-2">
						<a
							mat-stroked-button
							color="primary"
							class="large w-100"
							aria-label="Download Terms of Use document"
							download="Security Services Applicant Terms"
							[href]="downloadFilePath"
						>
							<mat-icon>file_download</mat-icon>Terms of Use
						</a>
					</div>
				</div>

				<div class="row">
					<div class="offset-xxl-1 col-xxl-10 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<mat-form-field class="w-auto">
							<mat-label>Date Signed</mat-label>
							<input matInput formControlName="dateSigned" />
							<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.conditions {
				max-height: 400px;
				overflow-y: auto;
			}
		`,
	],
	standalone: false,
})
export class StepGdsdTermsOfUseComponent implements LicenceChildStepperStepComponent {
	hasScrolledToBottom = false;
	displayValidationErrors = false;

	bcServicesCardUrl = SPD_CONSTANTS.urls.bcServicesCardUrl;
	bcGovPrivacyUrl = SPD_CONSTANTS.urls.bcGovPrivacyUrl;
	bcGovDisclaimerUrl = SPD_CONSTANTS.urls.bcGovDisclaimerUrl;
	downloadFilePath = SPD_CONSTANTS.files.securityServicesApplicantUpdateTerms;

	form = this.gdsdApplicationService.termsAndConditionsFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	// TODO GDSD update terms of use

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.displayValidationErrors = !this.hasScrolledToBottom;

		return this.form.valid && this.hasScrolledToBottom;
	}

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
			this.setFormValid();
		}
	}

	onCheckboxChange(): void {
		this.setFormValid();
	}

	private setFormValid(): void {
		if (!this.hasScrolledToBottom) {
			return;
		}

		const data = this.form.value;
		if (data.agreeToTermsAndConditions) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}
}
