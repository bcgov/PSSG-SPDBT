import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { distinctUntilChanged } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';

@Component({
	selector: 'app-business-licence-wizard-replacement',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-business-licence-confirmation
							[applicationTypeCode]="applicationTypeReplace"
						></app-step-business-licence-confirmation>

						<app-wizard-footer
							nextButtonLabel="Pay Now"
							(previousStepperStep)="onGotoBusinessProfile()"
							(nextStepperStep)="onPayNow()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class BusinessLicenceWizardReplacementComponent extends BaseWizardComponent implements OnInit {
	applicationTypeReplace = ApplicationTypeCode.Replacement;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(ApplicationTypeCode.Replacement);
	}

	onPayNow(): void {
		this.businessApplicationService.payBusinessLicenceUpdateOrReplace({
			applicationTypeCode: ApplicationTypeCode.Replacement,
		});
	}
}
