import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { UtilService } from 'src/app/core/services/util.service';
import { AppInviteOrgData, CrcFormStepComponent } from '../crc.component';

@Component({
	selector: 'app-consent-to-crc',
	template: `
		<section class="step-section p-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to share a Criminal Record Check" [subtitle]="certifyLabel"></app-step-title>
					<div class="row">
						<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
							<mat-checkbox formControlName="shareCrc">
								I understand that to share the result of a criminal record check, I must have completed a criminal
								record check within the last 5 years through the Criminal Records Review Program (CRRP) and the sharing
								request must be for the same type of check as previously completed, either for children, vulnerable
								adults, or both children and vulnerable adults.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('shareCrc')?.dirty || form.get('shareCrc')?.touched) &&
									form.get('shareCrc')?.invalid &&
									form.get('shareCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="completedCrc">
								I confirm I have completed a criminal record check within the past five years with the CRRP which did
								not result in a determination of risk to children and/or vulnerable adults as defined in the Criminal
								Records Review Act. I understand no details will be disclosed to the organization I am applying to, only
								the result. I hereby consent to share the result of the completed check with the organization I am
								applying to.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('completedCrc')?.dirty || form.get('completedCrc')?.touched) &&
									form.get('completedCrc')?.invalid &&
									form.get('completedCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="notifyNoCrc">
								I understand that if the Registrar determines I do not have criminal record check to share according to
								the above criteria, I will be promptly notified.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('notifyNoCrc')?.dirty || form.get('notifyNoCrc')?.touched) &&
									form.get('notifyNoCrc')?.invalid &&
									form.get('notifyNoCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="notifyRisk">
								I understand that within 5 years of the date of my completing this Consent to Share a Criminal Record
								Check form, should the CRRP make a determination that I pose a risk to children and/or vulnerable
								adults, the Deputy Registrar will promptly provide notification to me and to the persons and entities
								(organizations) identified on this Consent to Share a Criminal Record Check.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('notifyRisk')?.dirty || form.get('notifyRisk')?.touched) &&
									form.get('notifyRisk')?.invalid &&
									form.get('notifyRisk')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class ConsentToCrcComponent implements CrcFormStepComponent {
	private _orgData!: AppInviteOrgData;
	@Input()
	set orgData(data: AppInviteOrgData) {
		this._orgData = data;
		const name = this.utilService.getFullName(data.contactGivenName, data.contactSurname);
		this.certifyLabel = `I, ${name}, consent to the following`;
	}
	get orgData(): AppInviteOrgData {
		return this._orgData;
	}

	booleanTypeCodes = BooleanTypeCode;
	certifyLabel = '';
	form: FormGroup = this.formBuilder.group({
		shareCrc: new FormControl('', [Validators.required]),
		completedCrc: new FormControl('', [Validators.required]),
		notifyNoCrc: new FormControl('', [Validators.required]),
		notifyRisk: new FormControl('', [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
