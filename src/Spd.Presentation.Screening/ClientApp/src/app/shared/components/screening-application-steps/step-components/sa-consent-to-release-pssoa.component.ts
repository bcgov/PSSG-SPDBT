import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sa-consent-to-release-pssoa',
	template: `
		<form [formGroup]="form" novalidate>
			<strong>PERMISSION, WAIVER and RELEASE</strong><br />
			<div>
				<mat-checkbox formControlName="agreeToCriminalCheck" (click)="onCheckboxChange()">
					Pursuant to Section 8(1) of the Privacy Act of Canada, and Sections 32(b) and 33(2)(c) of the British Columbia
					Freedom of Information and Protection of Privacy Act (FOIPPA), by my signature below I hereby consent to a
					check for records of criminal convictions, outstanding charges, and/or arrests. Other documents or information
					in the custody of the police, the courts, corrections, or crown counsel may be accessed in order to assess any
					information found as a result of the criminal record check.
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
					I authorize the release of this information to the Personnel Security Screening Office of the Ministry of
					Public Safety and Solicitor General for the purposes of determining my suitability for a position in the BC
					Public Service. I understand that my consent will be retained on file.
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
					Subsequent to this record check, I agree to report any incident to the Personnel Security Screening Office if
					I am arrested, charged or convicted of any criminal offence or any other federal or provincial statutory
					offence, including any suspension of driving privileges but excluding any ticket-only driving infractions or
					municipal by-law contraventions.
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
			<p>
				This information is collected by the British Columbia Public Service under s.26(c) of FOIPPA. Any questions
				about the collection and use of this information can be directed to an HR Service Representative at the BC
				Public Service Agency by submitting a request at AskMyHR, phoning: 1-877-277-0772 or writing to: Manager,
				Contact Centre Operations, BC Public Service Agency 810 Blanshard St. Victoria, B.C. V8W 2H2
			</p>
			<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
				I hereby release and forever discharge (i) His Majesty the King in Right of Canada, the Royal Canadian Mounted
				Police, their members, employees, agents and assigns, and (ii) His Majesty the King in Right of the Province of
				British Columbia and all employees and agents of the Province of British Columbia from any and all actions,
				causes of actions, claims, complaints and demands for any form of relief, damages, loss or injury which may
				hereafter be sustained by myself, howsoever arising from the above authorized disclosure of information and
				waive all rights thereto.
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
export class SaConsentToReleasePssoaComponent {
	@Input() form!: FormGroup;

	@Output() checkboxChanged: EventEmitter<any> = new EventEmitter();

	onCheckboxChange(): void {
		this.checkboxChanged.emit();
	}
}
