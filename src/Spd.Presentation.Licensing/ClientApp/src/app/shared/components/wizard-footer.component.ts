import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-wizard-footer',
	template: `
		<div class="row wizard-button-row">
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<ng-container *ngIf="showSaveAndExit; else showCancel">
					<button
						*ngIf="isSaveAndExitObserved"
						mat-flat-button
						class="large button-small-caps bordered mb-2"
						(click)="onSaveAndExit()"
					>
						Save & Exit
					</button>
				</ng-container>
				<ng-template #showCancel>
					<button mat-flat-button class="large bordered mb-2" (click)="onExit()">Cancel</button>
				</ng-template>
			</div>

			<ng-container *ngIf="isPreviousStepperStepObserved; else noPreviousButton">
				<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
					<button
						*ngIf="isPreviousStepperStepObserved"
						mat-stroked-button
						color="primary"
						class="large mb-2"
						(click)="onPrevious()"
					>
						Previous
					</button>
				</div>
				<div class="col-md-12" [ngClass]="isWideNext ? 'col-xxl-3 col-xl-4 col-lg-4' : 'col-xxl-2 col-xl-3 col-lg-3'">
					<button
						*ngIf="isNextStepperStepObserved"
						mat-flat-button
						color="primary"
						class="large mb-2"
						(click)="onNext()"
					>
						{{ nextButtonLabel }}
					</button>
				</div>
			</ng-container>
			<ng-template #noPreviousButton>
				<div class="offset-xxl-2 col-xxl-4 col-xl-6 col-lg-6 col-md-12">
					<button
						*ngIf="isNextStepperStepObserved"
						mat-flat-button
						color="primary"
						class="large mb-2"
						(click)="onNext()"
					>
						{{ nextButtonLabel }}
					</button>
				</div>
			</ng-template>

			<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
				<button
					*ngIf="isNextReviewStepperStepObserved"
					mat-stroked-button
					color="primary"
					class="large button-small-caps mb-2"
					(click)="onReview()"
				>
					Next: Review
				</button>
			</div>
		</div>
	`,
	styles: [
		`
			.button-small-caps {
				font-variant: small-caps;
			}
		`,
	],
})
export class WizardFooterComponent implements OnInit {
	isSaveAndExitObserved = false;
	isPreviousStepperStepObserved = false;
	isNextStepperStepObserved = false;
	isNextReviewStepperStepObserved = false;

	@Input() nextButtonLabel = 'Next';
	@Input() isFormValid = false;
	@Input() showSaveAndExit = false;
	@Input() isWideNext = false;

	@Output() saveAndExit: EventEmitter<any> = new EventEmitter();
	@Output() previousStepperStep: EventEmitter<any> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<any> = new EventEmitter();
	@Output() nextReviewStepperStep: EventEmitter<number> = new EventEmitter();

	constructor(private commonApplicationService: CommonApplicationService) {}

	ngOnInit(): void {
		this.isSaveAndExitObserved = this.saveAndExit.observed;
		this.isPreviousStepperStepObserved = this.previousStepperStep.observed;
		this.isNextStepperStepObserved = this.nextStepperStep.observed;
		this.isNextReviewStepperStepObserved = this.nextReviewStepperStep.observed;
	}

	onSaveAndExit(): void {
		this.saveAndExit.emit();
	}

	onPrevious(): void {
		this.previousStepperStep.emit();
	}

	onNext(): void {
		this.nextStepperStep.emit();
	}

	onReview(): void {
		this.nextReviewStepperStep.emit();
	}

	onExit(): void {
		this.commonApplicationService.cancelAndLoseChanges();
	}
}
