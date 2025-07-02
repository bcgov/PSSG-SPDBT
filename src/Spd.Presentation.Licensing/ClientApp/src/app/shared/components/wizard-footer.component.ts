import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DialogComponent, DialogOptions } from './dialog.component';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-wizard-footer',
	template: `
		<div class="row wizard-button-row">
		  <div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
		    @if (showExit) {
		      @if (showSaveAndExit) {
		        @if (isSaveAndExitObserved) {
		          <button
		            mat-flat-button
		            class="large button-small-caps bordered mb-2"
		            (click)="onSaveAndExit()"
		            >
		            Save & Exit
		          </button>
		        }
		      } @else {
		        <button mat-flat-button class="large bordered mb-2" (click)="onCancel()">{{ cancelLabel }}</button>
		      }
		    }
		  </div>
		
		  @if (isPreviousStepperStepObserved) {
		    <div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
		      @if (isPreviousStepperStepObserved) {
		        <button
		          mat-stroked-button
		          color="primary"
		          class="large mb-2"
		          (click)="onPrevious()"
		          aria-label="Go to the previous step"
		          >
		          Previous
		        </button>
		      }
		    </div>
		    <div
		      class="col-md-12"
					[ngClass]="
						isWidestNext
							? 'col-xxl-6 col-xl-6 col-lg-6'
							: isWideNext
								? 'col-xxl-3 col-xl-3 col-lg-4'
								: 'col-xxl-2 col-xl-3 col-lg-3'
					"
		      >
		      @if (isNextStepperStepObserved) {
		        <button
		          mat-flat-button
		          color="primary"
		          class="large mb-2"
		          (click)="onNext()"
		          aria-label="Go to the next step"
		          >
		          {{ nextButtonLabel }}
		        </button>
		      }
		    </div>
		  } @else {
		    <div
		      class="col-md-12"
					[ngClass]="
						isWideNext ? 'offset-xxl-2 col-xxl-4 col-xl-4 col-lg-6' : 'offset-xxl-3 col-xxl-2 col-xl-3 col-lg-3'
					"
		      >
		      @if (isNextStepperStepObserved) {
		        <button
		          mat-flat-button
		          color="primary"
		          class="large mb-2"
		          (click)="onNext()"
		          aria-label="Go to the next step"
		          >
		          {{ nextButtonLabel }}
		        </button>
		      }
		    </div>
		  }
		
		  @if (isSoleProprietorSimultaneousFlow) {
		    <div
		      class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"
					[ngClass]="
						!isWideNext && !isPreviousStepperStepObserved
							? 'offset-xxl-3'
							: !isWideNext && isPreviousStepperStepObserved
								? 'offset-xxl-2'
								: 'offset-xxl-1'
					"
		      >
		      @if (isCancelAndExitObserved) {
		        <button
		          mat-flat-button
		          class="large button-small-caps bordered mb-2"
		          (click)="onCancelAndExit()"
		          >
		          {{ cancelAndExitLabel }}
		        </button>
		      }
		    </div>
		  } @else {
		    @if (isFormValid) {
		      <div
		        class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"
		        [ngClass]="isPreviousStepperStepObserved ? 'offset-xxl-2' : 'offset-xxl-3'"
		        >
		        @if (isNextReviewStepperStepObserved) {
		          <button
		            mat-stroked-button
		            color="primary"
		            class="large button-small-caps mb-2"
		            (click)="onReview()"
		            >
		            Next: Review
		          </button>
		        }
		      </div>
		    }
		  }
		</div>
		`,
	styles: [
		`
			.button-small-caps {
				font-variant: small-caps;
			}
		`,
	],
	standalone: false,
})
export class WizardFooterComponent implements OnInit {
	isSaveAndExitObserved = false;
	isCancelObserved = false;
	isCancelAndExitObserved = false;
	isPreviousStepperStepObserved = false;
	isNextStepperStepObserved = false;
	isNextReviewStepperStepObserved = false;

	@Input() nextButtonLabel = 'Next';
	@Input() cancelAndExitLabel = 'Exit';
	@Input() cancelLabel = 'Exit';
	@Input() isFormValid = false;
	@Input() showSaveAndExit = false;
	@Input() isWideNext = false;
	@Input() isWidestNext = false;
	@Input() showExit = true;
	@Input() isSoleProprietorSimultaneousFlow = false;

	@Output() saveAndExit: EventEmitter<any> = new EventEmitter();
	@Output() cancelStep: EventEmitter<any> = new EventEmitter();
	@Output() cancelAndExit: EventEmitter<any> = new EventEmitter();
	@Output() previousStepperStep: EventEmitter<any> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<any> = new EventEmitter();
	@Output() nextReviewStepperStep: EventEmitter<number> = new EventEmitter();

	constructor(
		private dialog: MatDialog,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.isSaveAndExitObserved = this.saveAndExit.observed;
		this.isCancelObserved = this.cancelStep.observed;
		this.isCancelAndExitObserved = this.cancelAndExit.observed;
		this.isPreviousStepperStepObserved = this.previousStepperStep.observed;
		this.isNextStepperStepObserved = this.nextStepperStep.observed;
		this.isNextReviewStepperStepObserved = this.nextReviewStepperStep.observed;
	}

	onSaveAndExit(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to save your changes and exit?',
			actionText: 'Exit',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.saveAndExit.emit();
				}
			});
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

	onCancelAndExit(): void {
		this.cancelAndExit.emit();
	}

	onCancel(): void {
		if (this.isCancelObserved) {
			this.cancelStep.emit();
			return;
		}

		this.commonApplicationService.cancelAndLoseChanges();
	}
}
