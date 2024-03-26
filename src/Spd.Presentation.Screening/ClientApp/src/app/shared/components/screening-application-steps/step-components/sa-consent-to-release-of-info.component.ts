import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-consent-to-release-of-info',
	template: `
		<section class="step-section p-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to a Criminal Record Check"></app-step-title>

					<ng-container *ngIf="orgData?.isCrrpa; else isPssoa">
						<div class="row">
							<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
								<div class="conditions p-3 mb-3">
									<strong>Please read and agree to each of the following statements</strong><br />
									<div>
										<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
											I hereby consent to a criminal record check pursuant to the
											<i>Criminal Records Review Act</i> (CRRA) to determine whether I have a conviction or outstanding
											charge for any relevant or specified offence(s) as defined under that Act (CRRA check). I hereby
											consent to a check of available law enforcement systems as further described below, including any
											local police records.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToCriminalCheck')?.dirty || form.get('agreeToCriminalCheck')?.touched) &&
												form.get('agreeToCriminalCheck')?.invalid &&
												form.get('agreeToCriminalCheck')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToVulnerableSectorSearch" (click)="onCheckboxChange()">
											I hereby consent to a Vulnerable Sector search to check if I have been convicted of and received a
											record suspension (formerly known as a pardon) for any sexual offences as per the
											<i>Criminal Records Review Act</i>. For more information on Vulnerable Sector searches, please
											visit the Royal Canadian Mounted Police (RCMP) website:
											<a href="http://www.rcmp-grc.gc.ca/en/types-criminal-background-checks" target="_blank"
												>http://www.rcmp-grc.gc.ca/en/types-criminal-background-checks</a
											>. I understand that as part of the Vulnerable Sector search, I may be required to submit
											fingerprints to confirm my identity. In addition, where the results of a check indicate that a
											criminal record or outstanding charge for a relevant or specified offence(s) may exist, I agree to
											provide my fingerprints to verify any such criminal record.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToVulnerableSectorSearch')?.dirty ||
													form.get('agreeToVulnerableSectorSearch')?.touched) &&
												form.get('agreeToVulnerableSectorSearch')?.invalid &&
												form.get('agreeToVulnerableSectorSearch')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<p>
										My organization and I will be notified that I have an outstanding charge or conviction for a
										relevant or specified offence(s), and that the matter has been referred to the Deputy Registrar for
										review.
									</p>
									<p>
										The Deputy Registrar will determine whether or not I present a risk of physical or sexual abuse to
										children and/or physical, sexual, or financial abuse to vulnerable adults as applicable; the
										determination will include consideration of any relevant or specified offence(s) for which I have
										received a record suspension (formerly known as a pardon).
									</p>
									<div>
										<mat-checkbox formControlName="agreeToReportCharge" (click)="onCheckboxChange()">
											If I am charged with or convicted of any relevant or specified offence(s) at any time subsequent
											to the criminal record check authorization herein, I agree to report the charge(s) or
											conviction(s) to my organization, in a timely manner, with a new criminal record check
											authorization.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToReportCharge')?.dirty || form.get('agreeToReportCharge')?.touched) &&
												form.get('agreeToReportCharge')?.invalid &&
												form.get('agreeToReportCharge')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<p>
										For the purpose of completing my CRRA check as described above, I authorize the collection and/or
										consent to the disclosure of my personal information within Canada, as follows:
									</p>
									<div>
										<mat-checkbox formControlName="agreeToBcCourtHistory" (click)="onCheckboxChange()">
											Pursuant to the <i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA), I hereby
											consent to the disclosure by the Ministry of Attorney General to the Deputy Registrar of my
											name(s), alias(es), if available, Correctional Service Number (CS#), history of contact with BC
											Court System, and my date of birth as found in the Justice Information System, JUSTIN.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToBcCourtHistory')?.dirty || form.get('agreeToBcCourtHistory')?.touched) &&
												form.get('agreeToBcCourtHistory')?.invalid &&
												form.get('agreeToBcCourtHistory')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToBcCorrectionsHistory" (click)="onCheckboxChange()">
											Pursuant to FoIPPA, I hereby consent to the disclosure by the Ministry of Public Safety and
											Solicitor General to the Deputy Registrar of my name(s), alias(es), CS#, history of contact with
											BC Corrections, and my date of birth as found on the BC Corrections’ client management software,
											CORNET.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToBcCorrectionsHistory')?.dirty ||
													form.get('agreeToBcCorrectionsHistory')?.touched) &&
												form.get('agreeToBcCorrectionsHistory')?.invalid &&
												form.get('agreeToBcCorrectionsHistory')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToDisclosurePersonalData" (click)="onCheckboxChange()">
											Pursuant to FoIPPA, I hereby consent to the disclosure by the Deputy Registrar to the Criminal
											Records Review Unit of the RCMP (CRRU) of my name(s), alias(es), CS#, date of birth, sex, driver’s
											licence/ BCID#, and history of contact with BC Court System and BC Corrections. I also authorize
											the collection, by the CRRU and other federal government institutions under the Privacy Act, of
											the same information and of any and all personal information relating to this CRRA check in
											support of my application, for the purpose of conducting a check of criminal investigations,
											charges, convictions and information in police databases, including incidents that did not result
											in conviction. For the same purpose, I also authorize the provision to the CRRU of my personal
											information by all queried federal, provincial and municipal Law Enforcement Agencies in Canada as
											well as other authorized public bodies under FoIPPA.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToDisclosurePersonalData')?.dirty ||
													form.get('agreeToDisclosurePersonalData')?.touched) &&
												form.get('agreeToDisclosurePersonalData')?.invalid &&
												form.get('agreeToDisclosurePersonalData')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToDisclosureToRegistrar" (click)="onCheckboxChange()">
											Pursuant to FoIPPA, the Privacy Act, and any other relevant applicable provincial and federal
											legislation, I hereby consent to the disclosure to the Deputy Registrar by the CRRU, the BC
											Municipal Law Enforcement Agencies as well as other authorized public body agencies of any
											personal information relating to my CRRA check. This personal information may include:
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToDisclosureToRegistrar')?.dirty ||
													form.get('agreeToDisclosureToRegistrar')?.touched) &&
												form.get('agreeToDisclosureToRegistrar')?.invalid &&
												form.get('agreeToDisclosureToRegistrar')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<ul>
										<li>
											Criminal record check or fingerprint- based criminal record verification by searching the Canadian
											Police Information Centre database;
										</li>
										<li>
											A police information check, including the Police Records Information Management Environment
											(PRIME-BC) and the Police Reporting and Occurrence System (PROS).
										</li>
									</ul>
									<div>
										<mat-checkbox formControlName="agreeToReleaseToRegistrar" (click)="onCheckboxChange()">
											In addition to the foregoing, and as may be required for the Deputy Registrar to make a
											determination pursuant to s. 4 (2) and 4 (3) CRRA, I further authorize the release to the Deputy
											Registrar of any documents in the custody of the police, the courts, corrections and crown counsel
											relating to any outstanding charges or convictions for any relevant or specified offence(s) as
											defined under the CRRA or any police investigations, charges, or convictions deemed relevant by
											the Deputy Registrar.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToReleaseToRegistrar')?.dirty ||
													form.get('agreeToReleaseToRegistrar')?.touched) &&
												form.get('agreeToReleaseToRegistrar')?.invalid &&
												form.get('agreeToReleaseToRegistrar')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<strong> Collection Notice </strong>
									<p>
										The Security Programs Division (SPD) will collect your personal information for the purpose of
										fulfilling the criminal record check requirements of the Criminal Records Review Act and in
										accordance with section 26(c) and 27(1)(a)(i) and (b) of the Freedom of Information and Protection
										of Privacy Act (FoIPPA). Additionally, SPD may collect personal information under section 26(e) and
										27(1)(a)(i) and (b) of FoIPPA for the purpose of evaluating the Criminal Records Review Program and
										activities to better serve you. Should you have any questions about the collection, use, or
										disclosure of your personal information, please contact the Policy Analyst of the Criminal Records
										Review Program, Security Programs Division via mail to PO Box 9217 Stn Prov Govt Victoria, BC V8W
										9J1; email to <a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a>; or by
										telephone at 1- 855-587-0185 (option 2).
									</p>
								</div>
							</div>
						</div>
					</ng-container>

					<ng-template #isPssoa>
						<div class="row">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<div class="conditions p-3 mb-3">
									<strong>PERMISSION, WAIVER and RELEASE</strong><br /><br />
									<div>
										<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
											Pursuant to Section 8(1) of the Privacy Act of Canada, and Sections 32(b) and 33(2)(c) of the
											British Columbia Freedom of Information and Protection of Privacy Act (FOIPPA), by my signature
											below I hereby consent to a check for records of criminal convictions, outstanding charges, and/or
											arrests. Other documents or information in the custody of the police, the courts, corrections, or
											crown counsel may be accessed in order to assess any information found as a result of the criminal
											record check.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToCriminalCheck')?.dirty || form.get('agreeToCriminalCheck')?.touched) &&
												form.get('agreeToCriminalCheck')?.invalid &&
												form.get('agreeToCriminalCheck')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToRelease" (click)="onCheckboxChange()">
											I authorize the release of this information to the Personnel Security Screening Office of the
											Ministry of Public Safety and Solicitor General for the purposes of determining my suitability for
											a position in the BC Public Service. I understand that my consent will be retained on file.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToRelease')?.dirty || form.get('agreeToRelease')?.touched) &&
												form.get('agreeToRelease')?.invalid &&
												form.get('agreeToRelease')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<div>
										<mat-checkbox formControlName="agreeToReportCharge" (click)="onCheckboxChange()">
											Subsequent to this record check, I agree to report any incident to the Personnel Security
											Screening Office if I am arrested, charged or convicted of any criminal offence or any other
											federal or provincial statutory offence, including any suspension of driving privileges but
											excluding any ticket-only driving infractions or municipal by-law contraventions.
										</mat-checkbox>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('agreeToReportCharge')?.dirty || form.get('agreeToReportCharge')?.touched) &&
												form.get('agreeToReportCharge')?.invalid &&
												form.get('agreeToReportCharge')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
									<p>
										This information is collected by the British Columbia Public Service under s.26(c) of FOIPPA. Any
										questions about the collection and use of this information can be directed to an HR Service
										Representative at the BC Public Service Agency by submitting a request at AskMyHR, phoning:
										1-877-277-0772 or writing to: Manager, Contact Centre Operations, BC Public Service Agency 810
										Blanshard St. Victoria, B.C. V8W 2H2
									</p>
									<mat-checkbox formControlName="agreeToWaiver" (click)="onCheckboxChange()">
										I hereby release and forever discharge (i) His Majesty the King in Right of Canada, the Royal
										Canadian Mounted Police, their members, employees, agents and assigns, and (ii) His Majesty the King
										in Right of the Province of British Columbia and all employees and agents of the Province of British
										Columbia from any and all actions, causes of actions, claims, complaints and demands for any form of
										relief, damages, loss or injury which may hereafter be sustained by myself, howsoever arising from
										the above authorized disclosure of information and waive all rights thereto.
									</mat-checkbox>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('agreeToWaiver')?.dirty || form.get('agreeToWaiver')?.touched) &&
											form.get('agreeToWaiver')?.invalid &&
											form.get('agreeToWaiver')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</div>
						</div>
					</ng-template>
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12 mt-4">
							<mat-form-field class="w-auto" style="background-color: unset;">
								<mat-label>Date Signed</mat-label>
								<input matInput formControlName="dateSigned" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			p {
				margin-bottom: 0.5rem !important;
			}

			ul {
				margin-bottom: 0 !important;
			}
			li:not(:last-child) {
				margin-bottom: 0.5em;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
	],
})
export class SaConsentToReleaseOfInfoComponent implements CrcFormStepComponent {
	matcher = new FormErrorStateMatcher();

	@Input() resetRecaptcha: Subject<void> = new Subject<void>();

	private _orgData: AppInviteOrgData | null = null;
	@Input() set orgData(value: AppInviteOrgData | null) {
		this._orgData = value;

		this.form = this.formBuilder.group({
			agreeToCriminalCheck: new FormControl(null, [Validators.requiredTrue]),
			agreeToVulnerableSectorSearch: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToReportCharge: new FormControl(null, [Validators.requiredTrue]),
			agreeToBcCourtHistory: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToBcCorrectionsHistory: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToDisclosurePersonalData: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToDisclosureToRegistrar: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToReleaseToRegistrar: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToRelease: new FormControl(null, !value?.isCrrpa ? [Validators.requiredTrue] : []),
			agreeToWaiver: new FormControl(null, !value?.isCrrpa ? [Validators.requiredTrue] : []),
			dateSigned: new FormControl(null, [Validators.required]),
		});
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	form!: FormGroup;

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	getDataToSave(): any {
		return {
			...this.form.value,
		};
	}

	isFormValid(): boolean {
		if (!this.form.valid) {
			this.utilService.scrollToCheckbox();
		}

		return this.form.valid;
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (this.orgData?.isCrrpa) {
			if (
				data.agreeToCriminalCheck &&
				data.agreeToVulnerableSectorSearch &&
				data.agreeToReportCharge &&
				data.agreeToBcCourtHistory &&
				data.agreeToBcCorrectionsHistory &&
				data.agreeToDisclosurePersonalData &&
				data.agreeToDisclosureToRegistrar &&
				data.agreeToReleaseToRegistrar
			) {
				this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
			} else {
				this.form.controls['dateSigned'].setValue('');
			}
		} else {
			if (data.agreeToCriminalCheck && data.agreeToRelease && data.agreeToReportCharge && data.agreeToWaiver) {
				this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
			} else {
				this.form.controls['dateSigned'].setValue('');
			}
		}
	}
}
