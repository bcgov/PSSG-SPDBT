import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { AppRoutes } from '@app/app.routes';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-application-type',
	template: `
		<app-step-section title="What type of Retired Dog Certification are you applying for?">
			<div class="row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<app-form-gdsd-application-type [form]="form"></app-form-gdsd-application-type>
				</div>
			</div>
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepRdApplicationTypeComponent implements OnInit {
	form: FormGroup = this.retiredDogApplicationService.applicationTypeFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private retiredDogApplicationService: RetiredDogApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.commonApplicationService.setGdsdApplicationTitle(ServiceTypeCode.RetiredServiceDogCertification);
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const applicationTypeCode = this.applicationTypeCode.value;
		this.commonApplicationService.setGdsdApplicationTitle(
			ServiceTypeCode.RetiredServiceDogCertification,
			applicationTypeCode
		);

		switch (applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.router.navigateByUrl(AppRoutes.pathGdsdAnonymous(AppRoutes.RETIRED_DOG_NEW_ANONYMOUS));
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Replacement: {
				this.router.navigateByUrl(AppRoutes.pathGdsdAnonymous(AppRoutes.RETIRED_DOG_ACCESS_CODE_ANONYMOUS));
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}
}
