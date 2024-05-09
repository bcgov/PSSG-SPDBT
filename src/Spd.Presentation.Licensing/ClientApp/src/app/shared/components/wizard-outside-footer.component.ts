import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-wizard-outside-footer',
	template: `
		<div class="row wizard-button-row">
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button class="large bordered mb-2" (click)="onCancel()">Cancel</button>
			</div>

			<div class="offset-xxl-2 col-xxl-4 col-xl-6 col-lg-6 col-md-12">
				<button *ngIf="isNextStepperStepObserved" mat-flat-button color="primary" class="large mb-2" (click)="onNext()">
					{{ nextButtonLabel }}
				</button>
			</div>
		</div>
	`,
	styles: [],
})
export class WizardOutsideFooterComponent implements OnInit {
	isNextStepperStepObserved = false;

	@Input() nextButtonLabel = 'Next';

	@Output() cancel: EventEmitter<any> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<any> = new EventEmitter();

	constructor(private commonApplicationService: CommonApplicationService) {}

	ngOnInit(): void {
		this.isNextStepperStepObserved = this.nextStepperStep.observed;
	}

	onNext(): void {
		this.nextStepperStep.emit();
	}

	onCancel(): void {
		this.cancel.emit();
	}
}
