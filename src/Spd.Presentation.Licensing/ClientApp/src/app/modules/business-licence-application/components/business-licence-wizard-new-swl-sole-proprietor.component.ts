import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizLicAppCommandResponse, BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';
import { StepsBusinessLicenceSwlSpInformationComponent } from './steps-business-licence-swl-sp-information.component';

@Component({
	selector: 'app-business-licence-wizard-new-swl-sole-proprietor',
	template: `
		<ng-container *ngIf="isInitialized$ | async">
			<mat-stepper
				[selectedIndex]="3"
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step [editable]="false" [completed]="true">
					<ng-template matStepLabel>Licence Selection</ng-template>
				</mat-step>

				<mat-step [editable]="false" [completed]="true">
					<ng-template matStepLabel>Worker Information</ng-template>
				</mat-step>

				<mat-step [editable]="false" [completed]="true">
					<ng-template matStepLabel>Review Worker Licence</ng-template>
				</mat-step>

				<mat-step [completed]="step1Complete">
					<ng-template matStepLabel>Business Information</ng-template>
					<app-steps-business-licence-swl-sp-information
						[applicationTypeCode]="applicationTypeCode"
						[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
						(childNextStep)="onChildNextStep()"
						(saveAndExit)="onSaveAndExit()"
						(cancelAndExit)="onReturnToSwl()"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-steps-business-licence-swl-sp-information>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Business Selection</ng-template>
					<app-steps-business-licence-selection
						[serviceTypeCode]="serviceTypeCode"
						[applicationTypeCode]="applicationTypeCode"
						[bizTypeCode]="bizTypeCode"
						[isBusinessLicenceSoleProprietor]="true"
						[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
						[isFormValid]="false"
						[showSaveAndExit]="true"
						(childNextStep)="onChildNextStep()"
						(saveAndExit)="onSaveAndExit()"
						(cancelAndExit)="onReturnToSwl()"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-steps-business-licence-selection>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Review Business Licence</ng-template>
					<app-steps-business-licence-review
						[serviceTypeCode]="serviceTypeCode"
						[applicationTypeCode]="applicationTypeCode"
						[isBusinessLicenceSoleProprietor]="true"
						[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextPayStep)="onNextPayStep()"
						(cancelAndExit)="onReturnToSwl()"
						(scrollIntoView)="onScrollIntoView()"
						(goToStep)="onGoToStep($event)"
					></app-steps-business-licence-review>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Pay</ng-template>
				</mat-step>
			</mat-stepper>
		</ng-container>
	`,
	styles: [],
})
export class BusinessLicenceWizardNewSwlSoleProprietorComponent
	extends BaseWizardComponent
	implements OnInit, OnDestroy
{
	isInitialized$ = this.businessApplicationService.waitUntilInitialized$;

	readonly STEP_BUSINESS_INFORMATION = 3; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 4;
	readonly STEP_REVIEW_AND_CONFIRM = 5;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isSoleProprietorSimultaneousSWLAnonymous!: boolean;
	isSoleProprietorSimultaneousFlow!: boolean;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;

	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceSwlSpInformationComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceSwlSpInformationComponent;
	@ViewChild(StepsBusinessLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
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
				this.serviceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
				this.bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
				)?.value;

				this.isSoleProprietorSimultaneousSWLAnonymous = this.businessApplicationService.businessModelFormGroup.get(
					'isSoleProprietorSimultaneousSWLAnonymous'
				)?.value;
				this.isSoleProprietorSimultaneousFlow = this.businessApplicationService.businessModelFormGroup.get(
					'isSoleProprietorSimultaneousFlow'
				)?.value;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToFirstStep();
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
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	onNextPayStep(): void {
		this.businessApplicationService.submitBusinessLicenceWithSwlCombinedFlowNew().subscribe({
			next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hotToastService.success(
					'Your business licence and security worker licence have been successfully submitted'
				);
				this.payNow(resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.saveStep(stepper);
	}

	onGoToStep(step: number) {
		this.stepsBusinessInformationComponent?.onGoToFirstStep();
		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		this.saveStep();
	}

	onSaveAndExit(): void {
		if (!this.businessApplicationService.isSaveAndExit()) {
			return;
		}

		this.businessApplicationService.partialSaveBusinessLicenceWithSwlCombinedFlow(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	onReturnToSwl(): void {
		const message = this.isSoleProprietorSimultaneousSWLAnonymous
			? '<strong>Are you sure you want to cancel your security business licence application?</strong><br><br>If you cancel this application, you will have to re-submit your Security Worker Licence application.'
			: '<strong>Are you sure you want to cancel your security business licence application?</strong><br><br>You will be returned to the portal to pay the application fee for your security worker licence.';

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message,
			actionText: 'Yes, cancel this application',
			cancelText: 'No, continue application',
			wideButtons: true,
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					if (this.isSoleProprietorSimultaneousSWLAnonymous) {
						this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
					} else {
						this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathReturnFromBusinessLicenceSoleProprietor());
					}
				}
			});
	}

	private saveStep(stepper?: MatStepper): void {
		if (this.businessApplicationService.isAutoSave()) {
			this.businessApplicationService.partialSaveBusinessLicenceWithSwlCombinedFlow().subscribe({
				next: (_resp: any) => {
					if (stepper) {
						if (stepper?.selected) stepper.selected.completed = true;
						stepper.next();
					} else {
						this.goToChildNextStep();
					}
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else if (stepper) {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		} else {
			this.goToChildNextStep();
		}
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToNextStep();
				break;
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowBusinessLicence(licenceAppId, 'Payment for new Business Licence application');
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateBusinessLicence();
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.businessApplicationService.isStepBackgroundInformationComplete();
		this.step2Complete = this.businessApplicationService.isStepLicenceSelectionComplete();
		this.step3Complete = this.businessApplicationService.isStepContactInformationComplete();
		this.step4Complete = this.businessApplicationService.isStepControllingMembersAndEmployeesComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
