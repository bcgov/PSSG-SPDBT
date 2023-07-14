import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { UtilService } from 'src/app/core/services/util.service';
import { AppInviteOrgData, CrcFormStepComponent } from '../crrpa.component';

@Component({
	selector: 'app-consent-to-crc',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to share a Criminal Record Check" [subtitle]="certifyLabel"></app-step-title>
					<div class="row">
						<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
							<mat-checkbox formControlName="consentToShareResultCrc">
								I understand that to share the result of a criminal record check, I must have completed a criminal
								record check within the last 5 years through the Criminal Records Review Program (CRRP) and the sharing
								request must be for the same type of check as previously completed, either for children, vulnerable
								adults, or both children and vulnerable adults.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('consentToShareResultCrc')?.dirty || form.get('consentToShareResultCrc')?.touched) &&
									form.get('consentToShareResultCrc')?.invalid &&
									form.get('consentToShareResultCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="consentToCompletedCrc">
								I confirm I have completed a criminal record check within the past five years with the CRRP which did
								not result in a determination of risk to children and/or vulnerable adults as defined in the Criminal
								Records Review Act. I understand no details will be disclosed to the organization I am applying to, only
								the result. I hereby consent to share the result of the completed check with the organization I am
								applying to.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('consentToCompletedCrc')?.dirty || form.get('consentToCompletedCrc')?.touched) &&
									form.get('consentToCompletedCrc')?.invalid &&
									form.get('consentToCompletedCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="consentToNotifyNoCrc">
								I understand that if the Registrar determines I do not have criminal record check to share according to
								the above criteria, I will be promptly notified.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('consentToNotifyNoCrc')?.dirty || form.get('consentToNotifyNoCrc')?.touched) &&
									form.get('consentToNotifyNoCrc')?.invalid &&
									form.get('consentToNotifyNoCrc')?.hasError('required')
								"
								>This is required</mat-error
							>
							<mat-checkbox formControlName="consentToNotifyRisk">
								I understand that within 5 years of the date of my completing this Consent to Share a Criminal Record
								Check form, should the CRRP make a determination that I pose a risk to children and/or vulnerable
								adults, the Deputy Registrar will promptly provide notification to me and to the persons and entities
								(organizations) identified on this Consent to Share a Criminal Record Check.
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('consentToNotifyRisk')?.dirty || form.get('consentToNotifyRisk')?.touched) &&
									form.get('consentToNotifyRisk')?.invalid &&
									form.get('consentToNotifyRisk')?.hasError('required')
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
	private _orgData!: AppInviteOrgData | null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;
		const name = this.utilService.getFullName(data.givenName, data.surname);
		this.certifyLabel = `I, ${name}, consent to the following:`;
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	booleanTypeCodes = BooleanTypeCode;
	certifyLabel = '';
	form: FormGroup = this.formBuilder.group({
		consentToShareResultCrc: new FormControl('', [Validators.requiredTrue]),
		consentToCompletedCrc: new FormControl('', [Validators.requiredTrue]),
		consentToNotifyNoCrc: new FormControl('', [Validators.requiredTrue]),
		consentToNotifyRisk: new FormControl('', [Validators.requiredTrue]),
	});

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
