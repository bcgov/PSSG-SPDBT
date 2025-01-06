import { Component } from '@angular/core';

@Component({
    selector: 'app-organization-problem',
    template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="Our program handles criminal record checks for specific organizations defined in the
						<i>Criminal Records Review Act</i>"
				></app-step-title>
				<div class="row">
					<div class="offset-md-3 col-md-6 col-sm-12">
						<div style="text-align: center;">
							<mat-icon class="organization-problem-icon">warning</mat-icon>
						</div>
						<div class="organization-problem">
							If none of these descriptions apply to your organization, please refer to
							<a
								href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check/employer-organizations"
								target="_blank"
							>
								our resources
							</a>
							for more information.
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
    styles: [
        `
			.organization-problem {
				padding: 1.2em;
				margin-bottom: 2em;
				max-width: 800px;
				text-align: center;
			}

			.organization-problem-icon {
				color: var(--color-red);
				font-size: 100px;
				height: 100px;
				width: 100px;
			}
		`,
    ],
    standalone: false
})
export class OrganizationProblemComponent {}
