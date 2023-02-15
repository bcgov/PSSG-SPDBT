import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section mt-4 pt-2 pb-4" style="margin-top: 8em;">
			<div class="row mt-4">
				<div class="col-sm-12 col-md-4 col-lg-3 mx-auto">
					<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/org-registration/']">
						Organization Registration
					</button>
				</div>
			</div>
		</section>

		<section class="step-section mt-4 pt-2 pb-4">
			<div class="row mt-4">
				<div class="col-sm-12 col-md-4 col-lg-3 mx-auto">
					<button mat-raised-button color="primary" class="large mb-2" (click)="goToScreening()">
						Screening Application
					</button>
				</div>
			</div>

			<div class="row mt-4">
				<div class="offset-md-4 col-md-4 col-sm-12">
					<mat-radio-group [(ngModel)]="paymentBy">
						<mat-radio-button value="APP">
							<strong>Applicant Paying</strong>
						</mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="ORG">
							<strong>Organization Paying</strong>
						</mat-radio-button>
					</mat-radio-group>
				</div>
			</div>
		</section>

		<section class="step-section mt-4 pt-2 pb-4">
			<div class="row mt-4">
				<div class="col-sm-12 col-md-4 col-lg-3 mx-auto">
					<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/dashboard/']">Dashboard</button>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LandingComponent {
	paymentBy: string = 'APP';

	constructor(private router: Router) {}

	goToScreening(): void {
		this.router.navigateByUrl('/scr-application', { state: { paymentBy: this.paymentBy } });
	}
}
