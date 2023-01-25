import { Component } from '@angular/core';

@Component({
	selector: 'app-completed',
	template: `
		<div class="step">
			<div class="title mb-5">
				Thank you! Your registration is complete, and a confirmation email has been sent to [email address]
			</div>
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<table class="mb-4">
						<tr>
							<td class="point__icon mr-4"><mat-icon>check</mat-icon></td>
							<td>
								Your application will be reviewed by our security screening staff. If we need any more information,
								we'll contact you.
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider class="my-3"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__icon"><mat-icon>check</mat-icon></td>
							<td>Check on your application status and get updates on progress.</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider class="my-3"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__icon"><mat-icon>check</mat-icon></td>
							<td>
								If your registration is approved, we'll send a link to the organization portal for you to manage all of
								your screenings.
							</td>
						</tr>
					</table>

					<!-- <div class="point mb-4">
						<div class="point__icon">
							<mat-icon>check</mat-icon>
						</div>
						<div class="point__text">
							Your application will be reviewed by our security screening staff. If we need any more information, we'll
							contact you.
						</div>
					</div>

					<div class="point mb-4">
						<div class="point__icon">
							<mat-icon>check</mat-icon>
						</div>
						<div class="point__text">Check on your application status and get updates on progress.</div>
					</div>

					<div class="point mb-4">
						<div class="point__icon">
							<mat-icon>check</mat-icon>
						</div>
						<div class="point__text">
							If your registration is approved, we'll send a link to the organization portal for you to manage all of
							your screenings.
						</div>
					</div> -->
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.point {
				&__icon {
					display: inline-block;

					.mat-icon {
						color: var(--color-primary);
						font-size: 50px;
						height: 50px;
						width: 50px;
					}
				}

				&__text {
				}
			}
		`,
	],
})
export class CompletedComponent {}
