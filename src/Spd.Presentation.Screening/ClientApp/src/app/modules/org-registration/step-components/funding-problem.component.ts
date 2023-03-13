import { Component } from '@angular/core';

@Component({
	selector: 'app-funding-problem',
	template: `
		<div class="step">
			<app-step-title
				title="Our program only handles criminal record checks for organizations that receive at least 50% of their
						operating budget funding from the B.C. Government"
			></app-step-title>
			<div class="row">
				<div class="offset-md-3 col-md-6 col-sm-12">
					<div style="text-align: center;">
						<mat-icon class="funding-problem-icon">warning</mat-icon>
					</div>
					<div class="funding-problem">
						Please make another selection, or refer to
						<a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank">
							our resources
						</a>
						on criminal record checks to find your local police detachment.
						<mat-icon class="smaller-icon" matTooltip="To be determined">help_outline</mat-icon>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.funding-problem {
				padding: 1.2em;
				margin-bottom: 2em;
				max-width: 800px;
				text-align: center;
			}

			.funding-problem-icon {
				color: var(--color-red);
				font-size: 100px;
				height: 100px;
				width: 100px;
			}
		`,
	],
})
export class FundingProblemComponent {}
