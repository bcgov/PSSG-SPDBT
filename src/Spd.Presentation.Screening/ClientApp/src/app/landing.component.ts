import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-3 mx-auto p-4" style="margin-top: 8em;">
			<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/org-registration/']">
				Organization Registration
			</button>
		</section>

		<section class="step-section col-3 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large mb-2" (click)="goToScreening()">
				Screening Application
			</button>

			<mat-radio-group [(ngModel)]="paymentBy">
				<mat-radio-button value="APP">
					<strong>Applicant Paying</strong>
				</mat-radio-button>
				<mat-divider class="my-3"></mat-divider>
				<mat-radio-button value="ORG">
					<strong>Organization Paying</strong>
				</mat-radio-button>
			</mat-radio-group>
		</section>

		<section class="step-section col-3 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/dashboard/home/']">
				Dashboard
			</button>
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
