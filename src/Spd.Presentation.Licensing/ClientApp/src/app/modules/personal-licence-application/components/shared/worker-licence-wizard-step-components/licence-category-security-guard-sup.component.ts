import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
    selector: 'app-licence-category-security-guard-sup',
    template: `
		<div class="row my-4">
			<div class="col-12 text-center">
				<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
			</div>
		</div>
	`,
    styles: [],
    standalone: false
})
export class LicenceCategorySecurityGuardSupComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.workerApplicationService.categorySecurityGuardSupFormGroup;
	title = '';

	constructor(
		private optionsPipe: OptionsPipe,
		private workerApplicationService: WorkerApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			'WorkerCategoryTypes'
		);
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
