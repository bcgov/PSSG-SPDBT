import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgRegistrationStatusCode } from 'src/app/api/models';
import { OrgRegistrationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routes';
import { CrrpRoutes } from '../crrp-portal/crrp-routes';
import { OrgRegistrationRoutes } from './org-registration-routes';

@Component({
    selector: 'app-registration-status',
    template: `
		@if (status) {
		  <div class="container mt-4">
		    <h2 class="text-center py-4 fw-normal">Where is my application right now?</h2>
		    <div class="row">
		      <div class="offset-lg-4 col-lg-4 offset-md-2 col-md-8 col-sm-12">
		        <table class="mt-4">
		          <tr
							[ngClass]="
								status === orgRegistrationStatusCodes.ApplicationSubmitted ? 'point__active' : 'point__inactive'
							"
		            >
		            <td>
		              <mat-icon>find_in_page</mat-icon>
		            </td>
		            <td class="px-4">
		              <div class="fs-4 mb-2">Application submitted</div>
		              @if (status === orgRegistrationStatusCodes.ApplicationSubmitted) {
		                <p class="fw-normal">
		                  If we need any more information, we’ll contact you.
		                </p>
		              }
		            </td>
		          </tr>
		          <tr>
		            <td colspan="2">
		              <mat-divider vertical class="divider"></mat-divider>
		            </td>
		          </tr>
		          <tr [ngClass]="status === orgRegistrationStatusCodes.InProgress ? 'point__active' : 'point__inactive'">
		            <td>
		              <mat-icon>task_alt</mat-icon>
		            </td>
		            <td class="px-4">
		              <div class="fs-4 mb-2">In progress</div>
		              @if (status === orgRegistrationStatusCodes.InProgress) {
		                <p class="fw-normal">
		                  If we need any more information, we’ll contact you.
		                </p>
		              }
		            </td>
		          </tr>
		          <tr>
		            <td colspan="2">
		              <mat-divider vertical class="divider"></mat-divider>
		            </td>
		          </tr>
		          <tr class="point__inactive">
		            <td>
		              <mat-icon>connect_without_contact</mat-icon>
		            </td>
		            <td class="px-4">
		              <div class="fs-4 mb-2">Complete</div>
		            </td>
		          </tr>
		        </table>
		      </div>
		    </div>
		  </div>
		}
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
					font-weight: 300;

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
    standalone: false
})
export class RegistrationStatusComponent implements OnInit {
	status = '';
	orgRegistrationStatusCodes = OrgRegistrationStatusCode;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private orgRegistrationService: OrgRegistrationService
	) {}

	ngOnInit(): void {
		const registrationNumber = this.route.snapshot.paramMap.get('id');
		if (!registrationNumber) {
			console.debug('RegistrationStatusComponent - missing id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		if (registrationNumber) {
			this.orgRegistrationService
				.apiOrgRegistrationsRegistrationNumberStatusGet({ registrationNumber })
				.pipe()
				.subscribe((resp: any) => {
					if (resp.status == OrgRegistrationStatusCode.CompleteFailed) {
						this.router.navigate([OrgRegistrationRoutes.path()]);
					} else if (resp.status == OrgRegistrationStatusCode.CompleteSuccess) {
						this.router.navigate([CrrpRoutes.path()]);
					}

					this.status = resp.status;
				});
		}
	}
}
