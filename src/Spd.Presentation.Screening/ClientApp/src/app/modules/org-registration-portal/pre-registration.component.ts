import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrgRegistrationStatusCode } from 'src/app/api/models';
import { OrgRegistrationService } from 'src/app/api/services';

@Component({
	selector: 'app-pre-registration',
	template: `
		<div class="container mt-4">
			<h2 class="text-center py-4 fw-normal">Where is my application right now?</h2>
			<div class="row">
				<div class="offset-lg-4 col-lg-4 offset-md-2 col-md-8 col-sm-12">
					<table class="mt-4">
						<tr
							[ngClass]="
								status == orgRegistrationStatusCodes.ApplicationSubmitted ? 'point__active' : 'point__inactive'
							"
						>
							<td>
								<mat-icon>find_in_page</mat-icon>
							</td>
							<td class="px-4">
								<div class="fs-5 mb-2">Application Submitted</div>
								<p *ngIf="status == orgRegistrationStatusCodes.ApplicationSubmitted">
									If we need any more information, we’ll contact you.
								</p>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr [ngClass]="status == orgRegistrationStatusCodes.InProgress ? 'point__active' : 'point__inactive'">
							<td>
								<mat-icon>task_alt</mat-icon>
							</td>
							<td class="px-4">
								<div class="fs-5 mb-2">In Progress</div>
								<p *ngIf="status == orgRegistrationStatusCodes.InProgress">
									If we need any more information, we’ll contact you.
								</p>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<mat-divider vertical class="divider"></mat-divider>
							</td>
						</tr>
						<tr [ngClass]="status == orgRegistrationStatusCodes.Complete ? 'point__active' : 'point__inactive'">
							<td>
								<mat-icon>connect_without_contact</mat-icon>
							</td>
							<td class="px-4">
								<div class="fs-5 mb-2">Complete</div>
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
				&__active {
					display: inline-block;
					color: var(--color-green);
					font-weight: 500;

					.mat-icon {
						color: var(--color-green);
					}
				}

				&__inactive {
					display: inline-block;
					color: var(--color-grey-inactive);
					font-weight: 500;

					.mat-icon {
						color: var(--color-grey-inactive);
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
				border-color: var(--color-grey-light);
				border-width: medium;
				width: 0px;
				position: relative;
			}
		`,
	],
})
export class PreRegistrationComponent {
	status = '';
	orgRegistrationStatusCodes = OrgRegistrationStatusCode;

	constructor(private route: ActivatedRoute, private orgRegistrationService: OrgRegistrationService) {}

	ngOnInit(): void {
		const registrationNumber = this.route.snapshot.paramMap.get('id');

		if (registrationNumber) {
			this.orgRegistrationService
				.apiOrgRegistrationsRegistrationNumberStatusGet({ registrationNumber })
				.pipe()
				.subscribe((resp: any) => {
					this.status = resp.status;
				});
		}
	}
}
