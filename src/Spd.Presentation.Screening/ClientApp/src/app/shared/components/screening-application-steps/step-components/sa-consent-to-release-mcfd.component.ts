import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sa-consent-to-release-mcfd',
	template: `
		<form [formGroup]="form" novalidate>
			<strong>Please read and agree to each of the following statements</strong><br /><br />
			<strong>Section 1 - Consent to Disclosure of Police Information</strong>
			<div>
				<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
					Pursuant to s. 33(2)(c) FOIPPA, I authorize the disclosure of the information I have provided in this form to
					the B.C. Ministry of Public Safety and Solicitor General (PSSG) for the purpose of facilitating checks of
					police records by the Criminal Records Review Unit (CRRU) of the Organized Crime Agency of British Columbia
					(OCABC) under the management and direction of the Royal Canadian Mounted Police (RCMP). Pursuant to s. 8(1) of
					the <i>Privacy Act of Canada</i>, I further authorize the CRRU to disclose the results of those checks to
					PSSG, based solely on a match between the information provided in this form and any information located on
					police computer systems and information located through local police indices including police involvement,
					charges regardless of disposition, and convictions including those that have been granted a record suspension.
					I further authorize PSSG to disclose this information to a delegated worker under the
					<i>Child, Family and Community Service Act</i> (CFCSA) for the purpose set out in Section 4 of this form.
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
			<strong> Section 2 - Consent to Disclosure of B.C. Correctional & Court Systems Information </strong>
			<div>
				<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
					Pursuant to s. 33(2)(c) FOIPPA, I authorize the disclosure to PSSG of the information I have provided in this
					form for PSSG to search B.C.'s correctional and court systems databases for criminal charges or convictions,
					court dates, and dispositions. I further authorize PSSG to disclose this information to a delegated worker
					under the CFCSA for the purpose set out in Section 4 of this form.
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
			<strong> Section 3 – Consent to Disclosure of Sexual Offence – Where Record Suspension Ordered </strong>
			<div>
				<mat-checkbox formControlName="check2" (click)="onCheckboxChange()"
					>I authorize a search by the CRRU of the RCMP's automated criminal records retrieval system to determine if I
					have been convicted of, and have been granted a record suspension for, any of the sexual offences that are
					listed in Schedule 2 to the <i>Criminal Records Act</i> (Canada). If there is a record of my conviction for
					one of the sexual offences listed in Schedule 2 in respect of which a record suspension was ordered, I consent
					to the disclosure of that record by the Commissioner of the RCMP to the Minister of Public Safety of Canada,
					who will in turn disclose the record to the CRRU, for further disclosure to PSSG. I further authorize PSSG to
					disclose the record to a delegated worker under the CFCSA for the purpose set out in Section 4 of this
					form.</mat-checkbox
				>
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
			<strong>Section 4 – Purpose, Waiver and Release, and Consent of Disclosures</strong>
			<div>
				<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
					By my signature below, I consent to the checks set out in Sections 1 to 3 of this form to be conducted. My
					consent to the disclosures set out in Sections 1 to 3 of this form is valid for the role being applied for and
					for a period of three years from the date of signature.
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
					I hereby release and forever discharge His Majesty the King in Right of Canada, His Majesty the King in Right
					of British Columbia, the RCMP, the OCABC, their members, employees, agents and assigns from any and all
					actions, claims and demands for damages, loss or injury, which may hereafter be sustained by me, howsoever
					arising out of the above authorized disclosures of information and waive all rights thereto.
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
					I understand that a delegated worker under the CFCSA will review the information obtained through the checks I
					have consented to in Sections 1 to 3 of this form for the purpose of assessing my suitability for the position
					I have applied for.
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
			<strong> Collection Notice </strong>
			<p>
				The information requested on this form is collected under the authority of the
				<i>Child, Family and Community Service Act</i> (CFCSA), s. 96(2.1), and section 26(c) of the
				<i>Freedom of Information and Protection of Privacy Act</i> (FOIPPA). The information provided will be used for
				the purpose of administering requirements of the CFCSA in compliance with FOIPPA and CFCSA. Any questions about
				the use, collection or disclosure of this information may be directed to Centralized Services Hub, 250-356-6085,
				<a href="mailto:CSH.GeneralEnquiries@gov.bc.ca">CSH.GeneralEnquiries&#64;gov.bc.ca</a>
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
export class SaConsentToReleaseMcfdComponent {
	@Input() form!: FormGroup;

	@Output() checkboxChanged: EventEmitter<any> = new EventEmitter();

	onCheckboxChange(): void {
		this.checkboxChanged.emit();
	}
}
