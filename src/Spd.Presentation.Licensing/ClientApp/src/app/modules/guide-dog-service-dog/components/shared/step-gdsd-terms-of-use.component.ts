import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
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
								Terms of Use for Submitting an Application for Guide Dog or Service Dog Certification Online
							</div>
							<p>
								In these Terms of Use, "you" or "your" includes the individual using or accessing the Electronic Guide
								Dog and Service Dog Portal (the "Site") to submit a new or renewal online application for a Guide Dog or
								Service Dog Certification. These Terms of Use apply to the online application process.
							</p>
							<p>
								These Terms of Use are an agreement between you and His Majesty the King in Right of the Province of
								British Columbia, represented by the Minister of Public Safety and Solicitor General (the "Province")
								and they govern your use of the Site. By clicking the box to indicate that you accept these Terms of
								Use, and in consideration of your use of the Site, you agree to the terms and conditions set out below.
							</p>
							<p>
								Your failure to abide by these Terms of Use may result in the suspension or cancellation of your use of
								or access to the Site. In addition, the Province reserves the right to pursue any remedy available at
								law or in equity.
							</p>
							<p class="fw-bold">Please print a copy of these Terms of Use for your records.</p>

							<ol>
								<div class="fs-5 terms-subtitle">Disclaimer:</div>
								<li class="mb-2">
									Reasonable efforts have been made to provide accurate, complete and timely information regarding the
									Site in general. However, you are encouraged to refer to the <i>Guide Dog and Service Dog Act</i> and
									other official information materials before submitting an online application for a Guide Dog or
									Service Dog Certification.
								</li>
								<li>
									THE SITE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND INCLUDING WARRANTY OF FITNESS FOR A
									PARTICULAR PURPOSE. USE OF THE SITE IS ENTIRELY AT YOUR OWN RISK AND YOU WILL BE LIABLE FOR ANY
									FAILURE TO ABIDE BY THESE TERMS OF USE.
								</li>
								<li>
									WITHOUT LIMITING THE GENERAL NATURE OF THE FOREGOING, THE PROVINCE DOES NOT REPRESENT OR WARRANT THAT:
									<ol type="a">
										<li>
											THE ACCURACY, COMPLETENESS OR CURRENCY OF THE SITE OR ANY ASSOCIATED INFORMATION, OR THAT ANY
											ERRORS WILL BE CORRECTED;
										</li>
										<li>
											THE SITE WILL FUNCTION IN A TIMELY MANNER OR WILL BE AVAILABLE WITHOUT ERROR, FAILURE OR
											INTERRUPTION; OR
										</li>
										<li>THE SITE WILL MEET YOUR EXPECTATIONS OR REQUIREMENTS.</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Information Collection:</div>
								<li>
									When you visit the Site, certain types of information are automatically collected from you, through
									the use of audit logs or cookies. This information is collected, used and disclosed in accordance with
									the Province’s
									<a aria-label="Navigate to Privacy Policy site" [href]="bcGovPrivacyUrl" target="_blank"
										>Privacy Policy</a
									>.
								</li>
								<li>
									The date and time of your acceptance of these Terms of Use will be logged. This will enable you to
									skip this step on future visits. However, if these Terms of Use are modified, they will be presented
									to you upon your next following visit and you will need to accept the modified terms in order to
									continue to access the Site. Notwithstanding the foregoing, you are responsible for reviewing these
									Terms of Use on a regular basis to ensure that you are aware of any modifications that may have been
									made. Your continued use of the Site constitutes your acceptance of any such modified Terms of Use.
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
									You must be authenticated before you can submit an online application for a new or renewed Guide Dog
									or Service Dog Certification. Your identity will be verified through your BC Services Card account
									login, approved government-issued ID, or other approved authentication method as may be implemented
									from time to time.
								</li>
								<li>
									Your identity will be verified each time you access the Site, and depending on the authentication
									method used, you may be required to follow a link to an external site, including the
									<a aria-label="Navigate to BC Services Card site" [href]="bcServicesCardUrl" target="_blank"
										>BC Services Card Site</a
									>, following which you will be returned to, and allowed to access the application portions of, the
									Site.
								</li>
								<div class="fs-5 terms-subtitle">Additional Terms and Personal Information Collection:</div>
								<li>
									You may be required to accept additional terms and conditions in order to use or access the BC
									Services Card Site. Your access to, and use of that site is governed by such additional terms,
									including the collection of any additional personal information for such purposes, as applicable.
								</li>
								<div class="fs-5 terms-subtitle">Warranty:</div>
								<li>
									In accessing or using the Site, you represent and warrant that you have the power and capacity to
									accept, execute and comply with these Terms of Use.
								</li>
								<div class="fs-5 terms-subtitle">Acceptable Use and Security:</div>
								<li>
									You must not:
									<ol type="a">
										<li>
											use the Site for any unlawful or inappropriate purpose, including hacking, data mining or other
											intrusion activities;
										</li>
										<li>
											input or upload any information which contains viruses, Trojan horses, worms, time bombs or other
											computer programming routines that may damage or interfere with the performance or function of the
											Site;
										</li>
										<li>
											divulge, share, compromise or permit any other person to use your login and password to access the
											Site;
										</li>
										<li>
											take any action that might reasonably be construed as altering, destroying, defeating,
											compromising or rendering ineffective the security related to the Site or being likely to affect
											other users of the Site;
										</li>
										<li>attempt to collect any information about other users of the Site; or</li>
										<li>
											decompile, disassemble, reverse engineer or otherwise copy any source code associated with the
											Site.
										</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Ownership and Non-permitted Uses:</div>
								<li>
									You acknowledge and agree that at all times the Province is the owner of any software, hardware,
									servers, networks or other equipment used to provide the Site.
								</li>
								<li>
									You will not take any action that would be inconsistent with or infringe any proprietary or
									intellectual property rights of the Province, in any software, hardware, servers, networks or other
									equipment, documentation or other information used to deliver or operate the Site.
								</li>
								<li>
									You will not remove or alter any proprietary symbol or notice, including any copyright notice,
									trademark or logo displayed in connection with the Site.
								</li>
								<div class="fs-5 terms-subtitle">Suspension or Cancellation of Services:</div>
								<li>
									Your access to or use of the Site may be suspended or cancelled at any time if:
									<ol>
										<li>
											you fail to abide by these Terms of Use, or other terms and conditions that may be posted on any
											website used to access the Site; or
										</li>
										<li>the Province deems such suspension or cancellation necessary for any good and valid reason.</li>
									</ol>
								</li>
								<li>
									The Province reserves the right, at any time, to:
									<ol>
										<li>make changes to the Site;</li>
										<li>stop operating the Site; and</li>
										<li>modify these Terms of Use at any time, without notice being provided directly to you.</li>
									</ol>
								</li>
								<div class="fs-5 terms-subtitle">Limitation of Liability:</div>
								<li>
									In addition to the Province’s general
									<a aria-label="Navigate to Limitation of Liabilities site" [href]="bcGovDisclaimerUrl" target="_blank"
										>Limitation of Liabilities</a
									>, you agree that under no circumstances will the Province be liable to you or to any other individual
									or entity for any direct, indirect, special, incidental, consequential or other loss, claim, injury or
									damage, whether foreseeable or unforeseeable (including without limitation claims for damages for loss
									of profits or business opportunities, use of or inability to use the Site, interruptions, deletion or
									corruption of files, loss of programs or information, errors, defects or delays) arising out of or in
									any way connected with your or their access to or use of the Site or any failure by you or them to
									abide by these Terms of Use and whether based on contract, tort, strict liability or any other legal
									theory. The previous sentence will apply even if the Province has been specifically advised of the
									possibility of any such loss, claim, injury or damage.
								</li>
								<div class="fs-5 terms-subtitle">Enforceability and Jurisdiction:</div>
								<li>
									If any term or provision of these Terms of Use is invalid, illegal or unenforceable, all other terms
									and provisions of these Terms of Use will nonetheless remain in full force and effect.
								</li>
								<li>
									All access to the Site will be governed by, and construed and interpreted in accordance with, the laws
									applicable in the Province of British Columbia, Canada.
								</li>
								<li>
									You hereby consent to the exclusive jurisdiction and venue of the courts of the Province of British
									Columbia, sitting in Victoria, for the hearing of any matter relating to or arising from these Terms
									of Use and/or your access to or use of the Site.
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
							download="Guide Dog Service Dog Applicant Terms of Use"
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
			li {
				margin-bottom: 0.5rem !important;
			}

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
	downloadFilePath = SPD_CONSTANTS.files.guideDogServiceDogTerms;

	form = this.gdsdTeamApplicationService.termsAndConditionsFormGroup;

	constructor(
		private utilService: UtilService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

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
