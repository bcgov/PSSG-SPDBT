import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sa-consent-to-release-crrpa',
	template: `
		<form [formGroup]="form" novalidate>
			<strong>Please read and agree to each of the following statements</strong><br />
			<div>
				<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
					I hereby consent to a criminal record check pursuant to the
					<i>Criminal Records Review Act</i> (CRRA) to determine whether I have a conviction or outstanding charge for
					any relevant or specified offence(s) as defined under that Act (CRRA check). I hereby consent to a check of
					available law enforcement systems as further described below, including any local police records.
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
					I hereby consent to a Vulnerable Sector search to check if I have been convicted of and received a record
					suspension (formerly known as a pardon) for any sexual offences as per the
					<i>Criminal Records Review Act</i>. For more information on Vulnerable Sector searches, please visit the Royal
					Canadian Mounted Police (RCMP) website:
					<a href="http://www.rcmp-grc.gc.ca/en/types-criminal-background-checks" target="_blank"
						>http://www.rcmp-grc.gc.ca/en/types-criminal-background-checks</a
					>. I understand that as part of the Vulnerable Sector search, I may be required to submit fingerprints to
					confirm my identity. In addition, where the results of a check indicate that a criminal record or outstanding
					charge for a relevant or specified offence(s) may exist, I agree to provide my fingerprints to verify any such
					criminal record.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('agreeToVulnerableSectorSearch')?.dirty || form.get('agreeToVulnerableSectorSearch')?.touched) &&
						form.get('agreeToVulnerableSectorSearch')?.invalid &&
						form.get('agreeToVulnerableSectorSearch')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<p>
				My organization and I will be notified that I have an outstanding charge or conviction for a relevant or
				specified offence(s), and that the matter has been referred to the Deputy Registrar for review.
			</p>
			<p>
				The Deputy Registrar will determine whether or not I present a risk of physical or sexual abuse to children
				and/or physical, sexual, or financial abuse to vulnerable adults as applicable; the determination will include
				consideration of any relevant or specified offence(s) for which I have received a record suspension (formerly
				known as a pardon).
			</p>
			<div>
				<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
					If I am charged with or convicted of any relevant or specified offence(s) at any time subsequent to the
					criminal record check authorization herein, I agree to report the charge(s) or conviction(s) to my
					organization, in a timely manner, with a new criminal record check authorization.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check1')?.dirty || form.get('check1')?.touched) &&
						form.get('check1')?.invalid &&
						form.get('check1')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<p>
				For the purpose of completing my CRRA check as described above, I authorize the collection and/or consent to the
				disclosure of my personal information within Canada, as follows:
			</p>
			<div>
				<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
					Pursuant to the <i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA), I hereby consent to the
					disclosure by the Ministry of Attorney General to the Deputy Registrar of my name(s), alias(es), if available,
					Correctional Service Number (CS#), history of contact with BC Court System, and my date of birth as found in
					the Justice Information System, JUSTIN.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check2')?.dirty || form.get('check2')?.touched) &&
						form.get('check2')?.invalid &&
						form.get('check2')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<div>
				<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
					Pursuant to FoIPPA, I hereby consent to the disclosure by the Ministry of Public Safety and Solicitor General
					to the Deputy Registrar of my name(s), alias(es), CS#, history of contact with BC Corrections, and my date of
					birth as found on the BC Corrections’ client management software, CORNET.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check3')?.dirty || form.get('check3')?.touched) &&
						form.get('check3')?.invalid &&
						form.get('check3')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<div>
				<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
					Pursuant to FoIPPA, I hereby consent to the disclosure by the Deputy Registrar to the Criminal Records Review
					Unit of the RCMP (CRRU) of my name(s), alias(es), CS#, date of birth, sex, driver’s licence/ BCID#, and
					history of contact with BC Court System and BC Corrections. I also authorize the collection, by the CRRU and
					other federal government institutions under the Privacy Act, of the same information and of any and all
					personal information relating to this CRRA check in support of my application, for the purpose of conducting a
					check of criminal investigations, charges, convictions and information in police databases, including
					incidents that did not result in conviction. For the same purpose, I also authorize the provision to the CRRU
					of my personal information by all queried federal, provincial and municipal Law Enforcement Agencies in Canada
					as well as other authorized public bodies under FoIPPA.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check4')?.dirty || form.get('check4')?.touched) &&
						form.get('check4')?.invalid &&
						form.get('check4')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<div>
				<mat-checkbox formControlName="check5" (click)="onCheckboxChange()">
					Pursuant to FoIPPA, the Privacy Act, and any other relevant applicable provincial and federal legislation, I
					hereby consent to the disclosure to the Deputy Registrar by the CRRU, the BC Municipal Law Enforcement
					Agencies as well as other authorized public body agencies of any personal information relating to my CRRA
					check. This personal information may include:
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check5')?.dirty || form.get('check5')?.touched) &&
						form.get('check5')?.invalid &&
						form.get('check5')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<ul>
				<li>
					Criminal record check or fingerprint- based criminal record verification by searching the Canadian Police
					Information Centre database;
				</li>
				<li>
					A police information check, including the Police Records Information Management Environment (PRIME-BC) and the
					Police Reporting and Occurrence System (PROS).
				</li>
			</ul>
			<div>
				<mat-checkbox formControlName="check6" (click)="onCheckboxChange()">
					In addition to the foregoing, and as may be required for the Deputy Registrar to make a determination pursuant
					to s. 4 (2) and 4 (3) CRRA, I further authorize the release to the Deputy Registrar of any documents in the
					custody of the police, the courts, corrections and crown counsel relating to any outstanding charges or
					convictions for any relevant or specified offence(s) as defined under the CRRA or any police investigations,
					charges, or convictions deemed relevant by the Deputy Registrar.
				</mat-checkbox>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('check6')?.dirty || form.get('check6')?.touched) &&
						form.get('check6')?.invalid &&
						form.get('check6')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
			<strong> Collection Notice </strong>
			<p>
				The Security Programs Division (SPD) will collect your personal information for the purpose of fulfilling the
				criminal record check requirements of the <i>Criminal Records Review Act</i> and in accordance with section
				26(c) and 27(1)(a)(i) and (b) of the <i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA).
				Additionally, SPD may collect personal information under section 26(e) and 27(1)(a)(i) and (b) of FoIPPA for the
				purpose of evaluating the Criminal Records Review Program and activities to better serve you. Should you have
				any questions about the collection, use, or disclosure of your personal information, please contact the Policy
				Analyst of the Criminal Records Review Program, Security Programs Division via mail to PO Box 9217 Stn Prov Govt
				Victoria, BC V8W 9J1; email to <a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a>; or
				by telephone at 1- 855-587-0185 (option 2).
			</p>
		</form>
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
		`,
	],
})
export class SaConsentToReleaseCrrpaComponent {
	@Input() form!: FormGroup;

	@Output() checkboxChanged: EventEmitter<any> = new EventEmitter();

	onCheckboxChange(): void {
		this.checkboxChanged.emit();
	}
}
