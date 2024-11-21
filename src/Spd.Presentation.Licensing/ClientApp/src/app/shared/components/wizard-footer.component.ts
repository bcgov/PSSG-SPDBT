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
				<ng-container *ngIf="showExit">
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
						<button mat-flat-button class="large bordered mb-2" (click)="onCancel()">Exit</button>
					</ng-template>
				</ng-container>
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
				<div
					class="col-md-12"
					[ngClass]="
						isWideNext ? 'offset-xxl-2 col-xxl-4 col-xl-4 col-lg-6' : 'offset-xxl-3 col-xxl-2 col-xl-3 col-lg-3'
					"
				>
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

			<ng-container *ngIf="isSoleProprietorSimultaneousFlow; else defaultFlow">
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
					<button
						mat-flat-button
						class="large button-small-caps bordered mb-2"
						(click)="onCancelAndExit()"
						*ngIf="isCancelAndExitObserved"
					>
						{{ cancelAndExitLabel }}
					</button>
				</div>
			</ng-container>
			<ng-template #defaultFlow>
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
			</ng-template>
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
	isCancelObserved = false;
	isCancelAndExitObserved = false;
	isPreviousStepperStepObserved = false;
	isNextStepperStepObserved = false;
	isNextReviewStepperStepObserved = false;

	@Input() nextButtonLabel = 'Next';
	@Input() cancelAndExitLabel = 'Exit';
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
