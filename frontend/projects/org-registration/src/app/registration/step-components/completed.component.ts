import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-completed',
	template: `
		<div class="step">
			<div class="title mb-5">
				Thank you!
				<div style="font-size: smaller">
					Your registration is complete, and a confirmation email has been sent to<br />
					{{ sendToEmailAddress }}
				</div>
			</div>
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<table class="mb-4">
						<tr>
							<td class="point__icon"><mat-icon>find_in_page</mat-icon></td>
							<td class="px-4">
								Your application will be reviewed by our security screening staff. If we need any more information,
								we'll contact you.
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__icon"><mat-icon>task_alt</mat-icon></td>
							<td class="px-4">Check on your application status and get updates on progress.</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__icon"><mat-icon>connect_without_contact</mat-icon></td>
							<td class="px-4">
								If your registration is approved, we'll send a link to the organization portal for you to manage all of
								your screenings.
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.point {
				&__icon {
					display: inline-block;
					color: var(--color-green);

					.mat-icon {
						color: var(--color-primary);
						font-size: 50px;
						height: 50px;
						width: 50px;
					}
				}
			}

			.divider {
				padding-left: 1.4rem !important;
				min-height: 50px;
				border-color: var(--color-green);
				border-width: medium;
				width: 0px;
				position: relative;
			}
		`,
	],
})
export class CompletedComponent {
	@Input() sendToEmailAddress = '';
}
