import { Component } from '@angular/core';

@Component({
	selector: 'app-eligibility-problem',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step">
				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="title mb-5">
							If this information is incorrect, reach out to your respective organization for more information.
						</div>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-3 col-md-6 col-sm-12">
						<div style="text-align: center;">
							<mat-icon class="eligibility-problem-icon">warning</mat-icon>
						</div>
						<div class="eligibility-problem">
							Reach out to “organization email” or if you have any further questions please visit our page linked here.
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.eligibility-problem {
				padding: 1.2em;
				margin-bottom: 2em;
				max-width: 800px;
				text-align: center;
			}

			.eligibility-problem-icon {
				color: var(--color-red);
				font-size: 100px;
				height: 100px;
				width: 100px;
			}
		`,
	],
})
export class EligibilityProblemComponent {}
