import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-monitor',
	template: `
		<div class="row my-4">
			<div class="col-12 text-center">
				<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmMonitorComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.categorySecurityAlarmMonitorFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityAlarmMonitor, 'WorkerCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
