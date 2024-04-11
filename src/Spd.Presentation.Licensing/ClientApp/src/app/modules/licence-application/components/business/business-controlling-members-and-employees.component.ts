import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-business-controlling-members-and-employees',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Controlling Members & Employees</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12 mb-3">
							Your business must have valid security worker licence holders in B.C. that support the various licence
							categories the business wishes to be licensed for. If your controlling members don't meet this
							requirement, add employees who do.
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<mat-accordion multi="false">
						<div class="mt-4">
							<app-alert type="info" [showBorder]="false" icon="" [withMarginBottom]="false">
								If your <b>controlling members</b> change during the business licence term, update their information
								here.
							</app-alert>
						</div>
						<mat-expansion-panel class="my-2 w-100">
							<mat-expansion-panel-header>
								<mat-panel-title class="title"> Controlling Members </mat-panel-title>
							</mat-expansion-panel-header>

							<app-common-business-controlling-members
								[form]="membersWithSwlFormGroup"
							></app-common-business-controlling-members>
						</mat-expansion-panel>

						<div class="mt-5">
							<app-alert type="info" [showBorder]="false" icon="" [withMarginBottom]="false">
								If your employees who are <b>licence holders</b> for the business change during the business licence
								term, update their information here.
							</app-alert>
						</div>
						<mat-expansion-panel class="my-2 w-100">
							<mat-expansion-panel-header>
								<mat-panel-title class="title"> Licence Holders </mat-panel-title>
							</mat-expansion-panel-header>

							<app-common-business-employees [form]="employeeWithSwlFormGroup"></app-common-business-employees>
						</mat-expansion-panel>
					</mat-accordion>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class BusinessControllingMembersAndEmployeesComponent {
	membersWithSwlFormGroup = this.businessApplicationService.membersWithSwlFormGroup;
	employeeWithSwlFormGroup = this.businessApplicationService.employeeWithSwlFormGroup;

	constructor(private router: Router, private businessApplicationService: BusinessApplicationService) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}
}
