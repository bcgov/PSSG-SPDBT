import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';

@Component({
	selector: 'app-gdsd-application-received',
	template: `
		<app-container>
			<app-step-section>
				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-6">
								<h2 class="fs-3 mt-0 mt-md-3">Application Received</h2>
							</div>
						</div>
						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<app-alert type="info" icon="info">
							<p>
								{{ message }}
							</p>
						</app-alert>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a
							mat-flat-button
							color="primary"
							aria-label="Close and navigate to GDSD Certification site"
							class="large w-100"
							[href]="certificationUrl"
							>Close</a
						>
					</div>
				</div>
			</app-step-section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class GdsdApplicationReceivedComponent implements OnInit {
	certificationUrl!: string;
	message = SPD_CONSTANTS.message.submissionSuccess;

	serviceTypeCode!: ServiceTypeCode;

	constructor(
		private route: ActivatedRoute,
		private commonApplicationService: CommonApplicationService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private dogTrainerApplicationService: DogTrainerApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		this.route.data.subscribe((data) => {
			this.serviceTypeCode = data['serviceTypeCode'];

			if (this.serviceTypeCode === ServiceTypeCode.GdsdTeamCertification) {
				this.certificationUrl = SPD_CONSTANTS.urls.serviceDogTeamCertificationUrl;
			} else {
				this.certificationUrl = SPD_CONSTANTS.urls.serviceDogDtRdCertificationUrl;
			}
		});

		if (this.gdsdTeamApplicationService.initialized) {
			this.gdsdTeamApplicationService.reset();
		} else if (this.dogTrainerApplicationService.initialized) {
			this.dogTrainerApplicationService.reset();
		} else if (this.retiredDogApplicationService.initialized) {
			this.retiredDogApplicationService.reset();
		} else {
			this.commonApplicationService.onGoToHome();
		}
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
