import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-common-user-profile-licence-criminal-history',
	template: `
		<mat-accordion>
			<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
				<mat-expansion-panel-header>
					<mat-panel-title>Criminal History</mat-panel-title>
				</mat-expansion-panel-header>

				<div class="mt-3">
					<div class="py-2">{{ title }}</div>

					<app-common-criminal-history
						[form]="form"
						[applicationTypeCode]="applicationTypeCode"
					></app-common-criminal-history>
				</div>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
})
export class CommonUserProfileLicenceCriminalHistoryComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private commonApplicationService: CommonApplicationService) {}

	ngOnInit(): void {
		this.title = this.commonApplicationService.getCriminalHistoryTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasCriminalHistory(): FormControl {
		return this.form.get('hasCriminalHistory') as FormControl;
	}
	get criminalChargeDescription(): FormControl {
		return this.form.get('criminalChargeDescription') as FormControl;
	}
	get isYesAndUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Update && this.hasCriminalHistory.value === BooleanTypeCode.Yes
		);
	}
}
