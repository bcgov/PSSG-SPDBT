import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ServiceTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AppInviteOrgData } from './screening-application.model';

@Component({
	selector: 'app-sa-step-appl-submitted',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-sa-application-submitted [emailAddress]="emailAddress"></app-sa-application-submitted>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onClose()">Close</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class SaStepApplSubmittedComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() orgData: AppInviteOrgData | null = null;
	@Input() emailAddress: string | null = null;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	getStepData(): any {
		return {};
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onClose(): void {
		switch (this.orgData?.serviceType) {
			case ServiceTypeCode.Mcfd:
				window.location.assign(SPD_CONSTANTS.closeRedirects.mcfdApplication);
				break;
			case ServiceTypeCode.PeCrc:
			case ServiceTypeCode.PeCrcVs:
				window.location.assign(SPD_CONSTANTS.closeRedirects.peCrcApplication);
				break;
			case ServiceTypeCode.Psso:
			case ServiceTypeCode.PssoVs:
				window.location.assign(SPD_CONSTANTS.closeRedirects.pssoCheck);
				break;
			default:
				window.location.assign(SPD_CONSTANTS.closeRedirects.crrpApplication);
				break;
		}
	}

	private dirtyForm(_step: number): boolean {
		return true;
	}
}
