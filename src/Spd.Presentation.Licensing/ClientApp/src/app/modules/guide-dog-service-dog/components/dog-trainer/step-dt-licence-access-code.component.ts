import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GuideDogServiceDogRoutes } from '../../guide-dog-service-dog-routes';
import { FormGdsdLicenceAccessCodeComponent } from '../shared/form-gdsd-licence-access-code.component';

@Component({
	selector: 'app-step-dt-licence-access-code',
	template: `
		<app-step-section
			title="Provide your access code"
			info="<p>
						You need both <strong>your licence number</strong> as it appears on your current certification, plus the <strong>access code number</strong>
						provided following your initial application or in your renewal letter from the Registrar, Security Services. Enter the two numbers below then click 'Next' to continue.
					</p>
					<p>
						If you do not know your access code, you may call Security Program's Licensing Unit during regular office
						hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
					</p>"
		>
			<app-form-gdsd-licence-access-code
				(linkSuccess)="onLinkSuccess($event)"
				[form]="form"
				[serviceTypeCode]="serviceTypeDogTrainer"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-gdsd-licence-access-code>
		</app-step-section>

		<app-wizard-footer (previousStepperStep)="onStepPrevious()" (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepDtLicenceAccessCodeComponent implements OnInit {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.dogTrainerApplicationService.accessCodeFormGroup;

	readonly serviceTypeDogTrainer = ServiceTypeCode.DogTrainerCertification;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormGdsdLicenceAccessCodeComponent) accessCodeComponent!: FormGdsdLicenceAccessCodeComponent;

	constructor(
		private router: Router,
		private dogTrainerApplicationService: DogTrainerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.applicationTypeCode = this.dogTrainerApplicationService.dogTrainerModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		this.commonApplicationService.setGdsdApplicationTitle(this.serviceTypeDogTrainer, this.applicationTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(
			GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.DOG_TRAINER_APPLICATION_TYPE_ANONYMOUS)
		);
	}

	onStepNext(): void {
		this.accessCodeComponent.searchByAccessCode();
	}

	onLinkSuccess(linkLicence: LicenceResponse): void {
		this.dogTrainerApplicationService
			.getLicenceWithAccessCodeAnonymous(linkLicence, this.applicationTypeCode!)
			.subscribe((_resp: any) => {
				switch (this.applicationTypeCode) {
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(
							GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.DOG_TRAINER_RENEWAL_ANONYMOUS)
						);
						break;
					}
					case ApplicationTypeCode.Replacement: {
						this.router.navigateByUrl(
							GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.DOG_TRAINER_REPLACEMENT_ANONYMOUS)
						);
						break;
					}
				}
			});
	}
}
