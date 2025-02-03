import { Component, OnInit } from '@angular/core';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

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

							<div class="no-print col-6">
								<div class="d-flex justify-content-end">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto m-2"
										aria-label="Print screen"
										(click)="onPrint()"
									>
										<mat-icon class="d-none d-md-block">print</mat-icon>Print
									</button>
								</div>
							</div>
						</div>
						<mat-divider class="mat-divider-main mb-3"></mat-divider>

						<div class="mt-4 text-center fs-5">
							Application for a Guide Dog or Service Dog Certificate has been received.
						</div>

						<div class="my-4 text-center">We will contact you if we need more information.</div>

						<div class="row mb-3">
							<div class="col-md-6 col-sm-12 mt-2">
								<div class="d-block payment__text-label text-md-end">Certificate Number</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-md-2">
								<div class="payment__text">xxx</div>
							</div>
						</div>

						<div class="no-print d-flex justify-content-end">
							<button
								mat-stroked-button
								color="primary"
								class="large w-auto m-2"
								aria-label="Back to main page"
								(click)="onBackToHome()"
							>
								<mat-icon>arrow_back</mat-icon>Back to Home
							</button>
						</div>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class GdsdApplicationReceivedSuccessComponent implements OnInit {
	gdsdModelData: any = {};

	constructor(
		private gdsdApplicationService: GdsdApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.gdsdModelData = { ...this.gdsdApplicationService.gdsdModelFormGroup.getRawValue() };

		// if (!this.gdsdApplicationService.initialized) {
		// 	this.commonApplicationService.onGoToHome();
		// }

		// TODO gdsd handle receive appl
		// do not allow the back button into the wizard
		// this.gdsdApplicationService.initialized = false;
	}

	onPrint(): void {
		window.print();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
