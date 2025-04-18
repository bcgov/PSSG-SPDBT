import { Component, OnInit } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';

@Component({
	selector: 'app-gdsd-application-received-success',
	template: `
		<app-container>
			<section class="step-section">
				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-6">
								<h2 class="fs-3 mt-0 mt-md-3">Submission Received</h2>
							</div>
						</div>
						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<app-alert type="info" icon="info">
							<p>{{ confirmationText }} A confirmation email has been sent you.</p>
							<p>We will contact you if we need more information.</p>
						</app-alert>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a
							mat-flat-button
							color="primary"
							aria-label="Close and navigate to SPD contact site"
							class="large w-100"
							[href]="contactSpdUrl"
							>Close</a
						>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class GdsdApplicationReceivedSuccessComponent implements OnInit {
	contactSpdUrl = SPD_CONSTANTS.urls.contactSpdUrl;
	confirmationText = '';

	constructor(
		private commonApplicationService: CommonApplicationService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private dogTrainerApplicationService: DogTrainerApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		if (this.gdsdTeamApplicationService.initialized) {
			this.confirmationText = 'Your application for a Guide Dog or Service Dog Certificate has been received.';
		} else if (this.dogTrainerApplicationService.initialized) {
			this.confirmationText = 'Your application for a Dog Trainer Certificate has been received.';
			return;
		} else if (this.retiredDogApplicationService.initialized) {
			this.confirmationText = 'Your application for a Retired Dog Certificate has been received.';
			return;
		} else {
			this.commonApplicationService.onGoToHome();
			return;
		}

		this.gdsdTeamApplicationService.reset();
		this.dogTrainerApplicationService.reset();
		this.retiredDogApplicationService.reset();
	}

	onPrint(): void {
		window.print();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
