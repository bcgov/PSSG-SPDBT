import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import {
	ApplicationTypeCode,
	BizLicAppCommandResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { UtilService } from '@app/core/services/util.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceConfirmationComponent } from './step-business-licence-confirmation.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceUpdatesComponent } from './steps-business-licence-updates.component';

@Component({
	selector: 'app-business-licence-wizard-update',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					class="mat-stepper-disable-header-navigation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-business-licence-confirmation></app-step-business-licence-confirmation>

						<app-wizard-footer
							(previousStepperStep)="onGotoBusinessProfile()"
							(nextStepperStep)="onGoToNextStep()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Licence Updates</ng-template>
						<app-steps-business-licence-updates
							[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
							[isUpdateFlowWithHideReprintStep]="isUpdateFlowWithHideReprintStep"
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-business-licence-updates>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-business-licence-review
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							[licenceCost]="newLicenceCost"
							[isRenewalShortForm]="false"
							[showSaveAndExit]="false"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onSubmitStep()"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-business-licence-review>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class BusinessLicenceWizardUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	newLicenceAppId: string | null = null;
	newLicenceCost = 0;
	isUpdateFlowWithHideReprintStep = false;

	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	isFormValid = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	isBusinessLicenceSoleProprietor!: boolean;
	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepBusinessLicenceConfirmationComponent)
	stepLicenceConfirmationComponent!: StepBusinessLicenceConfirmationComponent;
	@ViewChild(StepsBusinessLicenceUpdatesComponent) stepsLicenceUpdatesComponent!: StepsBusinessLicenceUpdatesComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent) stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private hotToastService: HotToastService,
		private commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.isBusinessLicenceSoleProprietor = this.businessApplicationService.businessModelFormGroup.get(
					'isBusinessLicenceSoleProprietor'
				)?.value;

				// for the update flow, need to keep track of changes.
				// This determines whether or not to show the 'reprint yes/no' step
				let isUpdateFlowWithHideReprintStep = false;
				if (this.applicationTypeCode === ApplicationTypeCode.Update) {
					const originalCategoriesList = this.businessApplicationService.businessModelFormGroup.get(
						'originalLicenceData.originalCategories'
					)?.value;
					const currentCategoriesData =
						this.businessApplicationService.businessModelFormGroup.get('categoryData')?.value;

					const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
					const currentCategoriesList = workerCategoryTypeCodes.filter((item: string) => {
						return !!currentCategoriesData[item];
					});

					// If the user has not changed the selected categories,
					// then prompt whether or not to reprint
					currentCategoriesList.sort((a: string, b: string) => this.utilService.sort(a, b));
					originalCategoriesList.sort((a: string, b: string) => this.utilService.sort(a, b));

					isUpdateFlowWithHideReprintStep = currentCategoriesList.join() != originalCategoriesList.join();
				}

				this.isUpdateFlowWithHideReprintStep = isUpdateFlowWithHideReprintStep;

				this.isFormValid = _resp;
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(this.applicationTypeCode);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	onNextPayStep(): void {
		this.commonApplicationService.payNowBusinessLicence(
			this.newLicenceAppId!,
			'Payment for update of Business Licence application'
		);
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		this.stepsLicenceUpdatesComponent?.onGoToNextStep();
	}

	onSubmitStep(): void {
		if (this.newLicenceAppId) {
			if (this.newLicenceCost > 0) {
				this.stepsReviewAndConfirm?.onGoToLastStep();
			} else {
				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.BUSINESS_UPDATE_SUCCESS));
			}
		} else {
			this.businessApplicationService
				.submitBusinessLicenceRenewalOrUpdateOrReplace(this.isUpdateFlowWithHideReprintStep)
				.subscribe({
					next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
						const bizLicenceCommandResponse = resp.body;

						// save this locally just in case application payment fails
						this.newLicenceAppId = bizLicenceCommandResponse.licenceAppId!;
						this.newLicenceCost = bizLicenceCommandResponse.cost ?? 0;
						if (this.newLicenceCost > 0) {
							this.stepsReviewAndConfirm?.onGoToLastStep();
						} else {
							this.hotToastService.success('Your business licence update has been successfully submitted');
							this.router.navigateByUrl(
								LicenceApplicationRoutes.path(LicenceApplicationRoutes.BUSINESS_UPDATE_SUCCESS)
							);
						}
					},
					error: (error: any) => {
						console.log('An error occurred during save', error);
						this.hotToastService.error('An error occurred during the save. Please try again.');
					},
				});
		}
	}
}
