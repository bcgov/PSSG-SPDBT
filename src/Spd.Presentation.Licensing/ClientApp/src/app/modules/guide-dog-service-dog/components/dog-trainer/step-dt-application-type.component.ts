import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { UtilService } from '@app/core/services/util.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';

@Component({
	selector: 'app-step-dt-application-type',
	template: `
		<app-step-section title="What type of Dog Trainer Certification are you applying for?">
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
export class StepDtApplicationTypeComponent implements OnInit {
	form: FormGroup = this.dogTrainerApplicationService.applicationTypeFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private dogTrainerApplicationService: DogTrainerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.commonApplicationService.setGdsdApplicationTitle(ServiceTypeCode.DogTrainerCertification);
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const applicationTypeCode = this.applicationTypeCode.value;
		this.commonApplicationService.setGdsdApplicationTitle(ServiceTypeCode.DogTrainerCertification, applicationTypeCode);

		switch (applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.router.navigateByUrl(
					GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.DOG_TRAINER_NEW_ANONYMOUS)
				);
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Replacement: {
				this.router.navigateByUrl(
					GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.DOG_TRAINER_ACCESS_CODE_ANONYMOUS)
				);
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
