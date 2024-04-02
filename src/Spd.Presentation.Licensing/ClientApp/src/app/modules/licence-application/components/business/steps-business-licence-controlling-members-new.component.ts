import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { StepBusinessLicenceApplicationOnHoldComponent } from './step-business-licence-application-on-hold.component';
import { StepBusinessLicenceControllingMemberConfirmationComponent } from './step-business-licence-controlling-member-confirmation.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMemberWithSwlComponent } from './step-business-licence-controlling-member-with-swl.component';
import { StepBusinessLicenceControllingMemberWithoutSwlComponent } from './step-business-licence-controlling-member-without-swl.component';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';

@Component({
	selector: 'app-steps-business-licence-controlling-members-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-controlling-member-with-swl></app-step-business-licence-controlling-member-with-swl>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_WITH_SWL)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_WITH_SWL)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-controlling-member-without-swl></app-step-business-licence-controlling-member-without-swl>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_WITHOUT_SWL)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_WITHOUT_SWL)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-controlling-member-confirmation></app-step-business-licence-controlling-member-confirmation>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_CONFIRMATION)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_CONFIRMATION)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-controlling-member-invites></app-step-business-licence-controlling-member-invites>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_INVITES)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_INVITES)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-employees></app-step-business-licence-employees>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_EMPLOYEES)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_EMPLOYEES)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-application-on-hold></app-step-business-licence-application-on-hold>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onStepNext(STEP_CONTROLLING_MEMBERS_EMPLOYEES)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CONTROLLING_MEMBERS_EMPLOYEES)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceControllingMembersNewComponent extends BaseWizardStepComponent {
	readonly STEP_CONTROLLING_MEMBERS_WITH_SWL = 1;
	readonly STEP_CONTROLLING_MEMBERS_WITHOUT_SWL = 2;
	readonly STEP_CONTROLLING_MEMBERS_CONFIRMATION = 3;
	readonly STEP_CONTROLLING_MEMBERS_INVITES = 4;
	readonly STEP_CONTROLLING_MEMBERS_EMPLOYEES = 5;
	readonly STEP_CONTROLLING_MEMBERS_ON_HOLD = 6;

	isFormValid = false;

	@ViewChild(StepBusinessLicenceControllingMemberWithSwlComponent)
	stepMembersWithSwlComponent!: StepBusinessLicenceControllingMemberWithSwlComponent;
	@ViewChild(StepBusinessLicenceControllingMemberWithoutSwlComponent)
	stepMembersWithoutSwlComponent!: StepBusinessLicenceControllingMemberWithoutSwlComponent;
	@ViewChild(StepBusinessLicenceControllingMemberConfirmationComponent)
	stepMembersConfirmationComponent!: StepBusinessLicenceControllingMemberConfirmationComponent;
	@ViewChild(StepBusinessLicenceControllingMemberInvitesComponent)
	stepMembersInvitesComponent!: StepBusinessLicenceControllingMemberInvitesComponent;
	@ViewChild(StepBusinessLicenceEmployeesComponent)
	stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;
	@ViewChild(StepBusinessLicenceApplicationOnHoldComponent)
	stepOnHoldComponent!: StepBusinessLicenceApplicationOnHoldComponent;

	constructor(private router: Router, private businessApplicationService: BusinessApplicationService) {
		super();
	}

	// ngOnInit(): void {
	// this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
	// 	(_resp: any) => {
	// 		// console.debug('permitModelValueChanges$', _resp);
	// 		this.isFormValid = _resp;
	// 		this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
	// 			'applicationTypeData.applicationTypeCode'
	// 		)?.value;
	// 	}
	// );
	// }

	// ngOnDestroy() {
	// 	// if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	// }

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathBusinessLicence()]);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CONTROLLING_MEMBERS_WITH_SWL:
				return this.stepMembersWithSwlComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_WITHOUT_SWL:
				return this.stepMembersWithoutSwlComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_CONFIRMATION:
				return this.stepMembersConfirmationComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_INVITES:
				return this.stepMembersInvitesComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_EMPLOYEES:
				return this.stepEmployeesComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_ON_HOLD:
				return this.stepOnHoldComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
