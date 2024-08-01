import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizLicAppCommandResponse, BizTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';
import { StepsBusinessLicenceSwlSpContactComponent } from './steps-business-licence-swl-sp-contact.component';
import { StepsBusinessLicenceSwlSpInformationComponent } from './steps-business-licence-swl-sp-information.component';

@Component({
	selector: 'app-business-licence-wizard-new-swl-sp',
	template: `
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
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(cancelAndExit)="onCancelAndExit()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-swl-sp-information>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Business Selection</ng-template>
				<app-steps-business-licence-selection
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[bizTypeCode]="bizTypeCode"
					[isBusinessLicenceSoleProprietor]="true"
					[isFormValid]="false"
					[showSaveAndExit]="false"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-selection>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Contact Information</ng-template>
				<app-steps-business-licence-swl-sp-contact></app-steps-business-licence-swl-sp-contact>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review Business Licence</ng-template>
				<app-steps-business-licence-review
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(saveAndExit)="onSaveAndExit()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-business-licence-review>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class BusinessLicenceWizardNewSwlSpComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_BUSINESS_INFORMATION = 3; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 4;
	readonly STEP_CONTACT_INFORMATION = 5;
	readonly STEP_REVIEW_AND_CONFIRM = 6;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;

	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceSwlSpInformationComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceSwlSpInformationComponent;
	@ViewChild(StepsBusinessLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	@ViewChild(StepsBusinessLicenceSwlSpContactComponent)
	stepsContactInformationComponent!: StepsBusinessLicenceSwlSpContactComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
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
				this.bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
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
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToFirstStep();
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
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	onNextPayStep(): void {
		this.businessApplicationService.submitBusinessLicenceNew().subscribe({
			next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hotToastService.success('Your business licence has been successfully submitted');
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
		this.stepsContactInformationComponent?.onGoToFirstStep();
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

		this.businessApplicationService.partialSaveBusinessLicenceStep(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	onCancelAndExit(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `<p><b>Are you sure you want to cancel your sole proprietor business licence application?</b></p>
						<p>If yes, you will redirected back to your security worker licence for review and payment.</p>`,
			actionText: 'Yes',
			cancelText: 'Close',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					// TODO Combined SP - how to know where to return back to? were they authenticated in bcsc previously?
					this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
				}
			});
	}

	private saveStep(stepper?: MatStepper): void {
		if (stepper) {
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
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToNextStep();
				break;
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowBusinessLicence(licenceAppId, 'Payment for new Business Licence application');
	}

	// private goToReviewStep(): void {
	// 	this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	// }

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateLicence();
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
