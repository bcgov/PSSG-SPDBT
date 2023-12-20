import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';

@Component({
	selector: 'app-licence-category-electronic-locking-device-installer',
	template: `
		<div class="row my-4">
			<div class="col-12 text-center">
				<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceCategoryElectronicLockingDeviceInstallerComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	form = this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			'WorkerCategoryTypes'
		);
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
