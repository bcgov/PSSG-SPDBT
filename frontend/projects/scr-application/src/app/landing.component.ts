import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-landing',
	template: `
		<div class="row" style="margin-top: 8em;">
			<div class="col-sm-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="goToScreening()">
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
	`,
	styles: [],
})
export class LandingComponent {
	paymentBy: string = 'APP';

	constructor(private router: Router) {}

	goToScreening(): void {
		console.log('paymentBy', this.paymentBy);
		this.router.navigateByUrl('/screening', { state: { paymentBy: this.paymentBy } });
	}
}
