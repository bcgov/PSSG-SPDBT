import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-log-in-options',
	template: `
		<section class="step-section pt-4 pb-5">
			<div class="step">
				<div class="title mb-5">Select your preferred log in option:</div>
				<div class="row">
					<div class="offset-md-3 col-md-3 col-sm-12">
						<button mat-stroked-button class="large mb-2" (click)="onClickNext()">Log In without BCSC</button>
					</div>
					<div class="col-md-3 col-sm-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onClickNext()">Log In with BCSC</button>
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
