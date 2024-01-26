import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';

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
