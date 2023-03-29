import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-log-in-options',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<div class="step">
				<app-step-title title="What is your preferred log in option?"></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
						<button mat-stroked-button class="large mb-2" (click)="onClickNext()">Log In without BCSC</button>
					</div>
					<div class="col-lg-4 col-md-6  col-sm-12">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onClickNext()">
							Log In with BCSC
						</button>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LogInOptionsComponent {
	@Output() clickNext: EventEmitter<boolean> = new EventEmitter<boolean>();

	onClickNext(): void {
		this.clickNext.emit(true);
	}
}
