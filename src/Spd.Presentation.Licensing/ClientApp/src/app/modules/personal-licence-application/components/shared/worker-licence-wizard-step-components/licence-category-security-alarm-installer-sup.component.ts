import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
@Component({
	selector: 'app-licence-category-security-alarm-installer-sup',
	template: `
		<div class="row my-4">
			<div class="col-12 text-center">
				<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmInstallerSupComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			'WorkerCategoryTypes'
		);
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
