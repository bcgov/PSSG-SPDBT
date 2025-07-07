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
				@if (isFormValid) {
					@if (isNextReviewStepperStepObserved) {
						<button
							mat-stroked-button
							color="primary"
							class="large button-small-caps mb-2"
							(click)="onReview()"
							aria-label="Go to the review step in the application"
						>
							Next: Review
						</button>
					}
				}
			</div>

			@if (isPreviousStepperStepObserved) {
				<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
					@if (isNextStepperStepObserved) {
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onNext()"
							aria-label="Go to the next step in the application"
						>
							{{ nextButtonLabel }}
						</button>
					}
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
					@if (isPreviousStepperStepObserved) {
						<button
							mat-stroked-button
							color="primary"
							class="large mb-2"
							(click)="onPrevious()"
							aria-label="Go to the previous step in the application"
						>
							Previous
						</button>
					}
				</div>
			} @else {
				<div class="offset-xxl-3 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
					@if (isNextStepperStepObserved) {
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onNext()"
							aria-label="Go to the next step in the application"
						>
							{{ nextButtonLabel }}
						</button>
					}
				</div>
			}

			@if (showExit) {
				<div
					class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"
					[ngClass]="isPreviousStepperStepObserved ? 'offset-xxl-2' : 'offset-xxl-3'"
				>
					@if (showSaveAndExit) {
						@if (isSaveAndExitObserved) {
							<button
								mat-flat-button
								class="large button-small-caps bordered mb-2"
								(click)="onSaveAndExit()"
								aria-label="Save the application and exit"
							>
								Save & Exit
							</button>
						}
					} @else {
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onCancel()"
							aria-label="Exit the application and discard data"
						>
							{{ cancelLabel }}
						</button>
					}
				</div>
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
	@Input() showExit = true;

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
