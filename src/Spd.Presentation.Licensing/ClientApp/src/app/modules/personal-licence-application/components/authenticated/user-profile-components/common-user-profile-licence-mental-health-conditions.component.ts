import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-common-user-profile-licence-mental-health-conditions',
	template: `
		<mat-accordion>
			<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
				<mat-expansion-panel-header>
					<mat-panel-title>Mental Health Condition</mat-panel-title>
				</mat-expansion-panel-header>

				<div class="mt-3">
					<div class="py-2">{{ title }}</div>
					<app-alert type="info" icon="" [showBorder]="false" *ngIf="subtitle">
						{{ subtitle }}
					</app-alert>

					<app-common-mental-health-conditions
						[applicationTypeCode]="applicationTypeCode"
						[form]="form"
					></app-common-mental-health-conditions>
				</div>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
})
export class CommonUserProfileLicenceMentalHealthConditionsComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	subtitle = '';

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.licenceApplicationService.getMentalHealthConditionsTitle(
			this.applicationTypeCode,
			this.hasPreviousMhcFormUpload.value
		);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasPreviousMhcFormUpload(): FormControl {
		return this.form.get('hasPreviousMhcFormUpload') as FormControl;
	}
}
