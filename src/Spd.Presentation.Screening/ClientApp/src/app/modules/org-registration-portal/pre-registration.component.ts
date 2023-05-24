import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-pre-registration',
	template: `
		<div class="container mt-4">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-step-title title="Pre-Registration"></app-step-title>
					<table class="mt-4">
						<tr>
							<td class="point__icon"><mat-icon>find_in_page</mat-icon></td>
							<td class="px-4">
								<div class="fs-5 mb-2">Application submitted</div>
								<p>
									Your registration application will be reviewed shortly. We will contact you if we need any more
									information.
								</p>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__green-icon"><mat-icon>task_alt</mat-icon></td>
							<td class="px-4">
								<div class="fs-5 mb-2">In progress</div>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr>
							<td class="point__icon"><mat-icon>connect_without_contact</mat-icon></td>
							<td class="px-4">
								<div class="fs-5 mb-2">Complete</div>
								<p>
									If your registration is approved, we'll send a link to the organization online service for you to
									manage all of your criminal record checks.
								</p>
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
				&__green-icon {
					display: inline-block;
					color: var(--color-green);

					.mat-icon {
						color: var(--color-green);
					}
				}

				&__icon {
					display: inline-block;
					color: var(--color-grey-light);

					.mat-icon {
						color: var(--color-grey-light);
					}
				}
			}

			.mat-icon {
				font-size: 50px;
				height: 50px;
				width: 50px;
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
export class PreRegistrationComponent {
	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		console.log('PreRegistrationComponent id', id);

		// this.orgUserService
		// 	.apiInvitationPost({ body: invitationRequest })
		// 	.pipe()
		// 	.subscribe((resp: any) => {
		// 		console.log('resp', resp);
		// 		}
		// 	});
	}
}
