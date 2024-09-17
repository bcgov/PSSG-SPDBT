import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sa-consent-to-release-pecrc',
	template: `
		<form [formGroup]="form" novalidate>
			<strong>PERMISSION, WAIVER and RELEASE</strong><br />
			<div>
				<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
					As the recipient of a conditional offer by the hiring organization identified in the Letter of Agreement (LOA)
					between of the Ministry of Public Safety and Solicitor General (PSSG) and the hiring organization (Prospective
					Employer), I understand that my Prospective Employer requires a criminal record check to inform their decision
					to hire me for the position applied for. I also understand that if I am hired for the position, a further
					criminal record check may be required at yearly intervals specified under the policy of my organization
					(Current Employer) to verify my ongoing suitability for the position (“Prospective Employer”, together with
					“Current Employer”, hereinafter referred to as my “Employer”). Under the LOA, my Employer is engaging PSSG’s
					Security Programs Division (SPD) to conduct the criminal record check and, if an Incident as defined below is
					identified, to prepare for my Employer a report summarizing SPD’s findings and a recommendation as to my
					hiring, or my ongoing suitability for the position, as the case may be.
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
				<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
					Pursuant to Section 8(1) of the Privacy Act of Canada, and Sections 32(b) and 33(2)(c) of the British Columbia
					Freedom of Information and Protection of Privacy Act (FOIPPA), by my signature below I hereby consent to a
					check for records of criminal convictions, outstanding charges, and/or arrests (each, an Incident). Other
					documents or information in the custody of the police, the courts, corrections, or crown counsel may be
					accessed in order to assess any information found as a result of the criminal record check.
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
			<div>
				<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
					Pursuant to the terms of the LOA between PSSG (SPD) and my Employer, I authorize the release of this
					information to SPD for the purposes of making a recommendation regarding my suitability for a position with my
					Employer. As may be required, I authorize SPD to release a copy of this consent to any third party deemed
					necessary in order to collect or verify any third-party information required for assessing my suitability. I
					understand that the final decision respecting my hiring, or ongoing suitability for a current position, as the
					case may be, is not made by SPD, but by my Employer. I understand that my consent to a criminal record check
					will be retained on file, as may be required or relied upon pursuant to the policy of my Employer.
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
					I certify that I have accurately disclosed the information requested to undergo this criminal record check
					process. I understand that if any Incident is identified as part of my criminal record check, I may be asked
					to provide further particulars. I hereby certify that any information that I will provide in this regard is
					complete, honest, and accurate to the best of my knowledge.
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
					I hereby release and forever discharge (i) His Majesty the King in Right of Canada, the Royal Canadian Mounted
					Police, their members, employees, agents and assigns, and (ii) His Majesty the King in Right of the Province
					of British Columbia and all employees and agents of the Province of British Columbia from any and all actions,
					causes of actions, claims, complaints and demands for any form of relief, damages, loss or injury which may
					hereafter be sustained by me, howsoever arising from the above authorized disclosure of information and waive
					all rights thereto.
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
			<strong> Collection Notice </strong>
			<p>
				The Security Programs Division (SPD) will collect your personal information for the purpose of fulfilling the
				criminal record check requirements set out by the policy of your Employer and in accordance with sections 26(c)
				and 27(1)(a)(i) and (b) of the <i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA). The
				information gathered from the criminal record check will be used by SPD to provide a recommendation as to your
				hiring or ongoing suitability to your Employer, who will make the final decision. Should you have any questions
				relating to the collection, use and disclosure of your personal information, please contact the Policy Analyst
				at Security Programs Division via mail to PO Box 9217 Stn Prov Govt Victoria, BC V8W 9J1; email to
				<a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a>; or by telephone at 1- 855-587-0185
				(option 2).
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
export class SaConsentToReleasePecrcComponent {
	@Input() form!: FormGroup;

	@Output() checkboxChanged: EventEmitter<any> = new EventEmitter();

	onCheckboxChange(): void {
		this.checkboxChanged.emit();
	}
}
