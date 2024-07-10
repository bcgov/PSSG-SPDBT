import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';

@Component({
	selector: 'app-payment-fail',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal m-2">
					<span *ngIf="isCancelledPaymentFlow; else paymentFailedHeader">Payment Cancelled</span>
					<ng-template #paymentFailedHeader>Payment Failed </ng-template>
				</h3>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button
						mat-stroked-button
						color="primary"
						class="large w-auto m-2"
						aria-label="Back"
						*ngIf="isBackRoute"
						(click)="onBack()"
					>
						<mat-icon>arrow_back</mat-icon>Back
					</button>
					<button
						mat-flat-button
						color="primary"
						class="large w-auto m-2"
						*ngIf="!isCancelledPaymentFlow && numberOfAttemptsRemaining > 0"
						aria-label="Try again"
						(click)="onPayNow()"
					>
						<mat-icon>payment</mat-icon>Try Again
					</button>
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<div class="d-flex justify-content-center">
			<div class="payment__image text-center">
				<img class="payment__image__item" src="./assets/payment-fail.png" alt="Payment fail" />
			</div>
		</div>

		<div class="row mx-4">
			<div class="col-12 mt-4">
				<div class="fw-normal fs-3 text-center">
					<span *ngIf="isCancelledPaymentFlow; else paymentFailedSubHeader">
						Your payment attempt has been cancelled
					</span>
					<ng-template #paymentFailedSubHeader>
						Your payment transaction has failed for<br />
						Case ID: {{ payment?.caseNumber }}
					</ng-template>
				</div>
			</div>

			<ng-container *ngIf="isCancelledPaymentFlow; else paymentFailed">
				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
					<div class="lead fs-5 mt-4 text-center">
						Your application is submitted, but it won't be processed until payment is received.
					</div>
				</div>
			</ng-container>

			<ng-template #paymentFailed>
				<ng-container *ngIf="isPayBySecureLink; else notSecureLink">
					<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
						<div class="lead fs-5 mt-4">
							Contact the Security Programs Division to request a new secure payment link:
							<ul>
								<li>include your Case ID</li>
								<li>email: <strong>spdscreening&#64;gov.bc.ca</strong></li>
								<li>toll-free: <strong>1-855-587-0185</strong> (press option 2)</li>
							</ul>
						</div>
						<div class="lead fs-5 my-4">
							Alternatively, you can download the
							<a
								tabindex="0"
								(click)="onDownloadManualPaymentForm()"
								(keydown)="onKeyDownDownloadManualPaymentForm($event)"
								>Manual Payment Form</a
							>. Fill it out, and follow the instructions to submit it to the Security Programs Division.
						</div>
					</div>
				</ng-container>

				<ng-template #notSecureLink>
					<ng-container *ngIf="numberOfAttemptsRemaining === 0; else remainingAttempts">
						<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
							<div class="lead fs-5 mt-4">
								Your application has been submitted, but it won't be processed until payment is received.
							</div>
							<div class="lead fs-5 my-4">
								Please download and complete the
								<a
									tabindex="0"
									(click)="onDownloadManualPaymentForm()"
									(keydown)="onKeyDownDownloadManualPaymentForm($event)"
									>Manual Payment Form</a
								>
								then follow the instructions on the form to submit payment to the Security Programs Division.
							</div>
						</div>
					</ng-container>

					<ng-template #remainingAttempts>
						<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
							<div class="lead fs-5 mt-4">
								Please ensure the information you entered is correct and try again, or use a different credit card. You
								have
								{{ numberOfAttemptsRemaining }} more attempt{{ numberOfAttemptsRemaining === 1 ? '' : 's' }}.
							</div>
							<div class="lead fs-5 my-4">
								Alternatively, you can download the
								<a
									tabindex="0"
									(click)="onDownloadManualPaymentForm()"
									(keydown)="onKeyDownDownloadManualPaymentForm($event)"
									>Manual Payment Form</a
								>. Fill it out, and follow the instructions to submit it to the Security Programs Division.
							</div>
						</div>
					</ng-template>
				</ng-template>
			</ng-template>
		</div>
	`,
	styles: [
		`
			a {
				color: var(--bs-link-color) !important;
			}
		`,
	],
})
export class PaymentFailComponent implements OnInit {
	isBackRoute = false;

	@Input() isPayBySecureLink = false;
	@Input() isCancelledPaymentFlow = false;

	private _payment: PaymentResponse | null = null;
	@Input()
	set payment(data: PaymentResponse | null) {
		if (data == null) {
			this._payment = null;
			return;
		}

		this._payment = data;

		if (data.paidSuccess) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}
	get payment(): PaymentResponse | null {
		return this._payment;
	}

	private _numberOfAttemptsRemaining!: number;
	@Input()
	set numberOfAttemptsRemaining(data: number | null) {
		if (data == null) {
			this._numberOfAttemptsRemaining = 0;
			return;
		}

		this._numberOfAttemptsRemaining = data;
	}
	get numberOfAttemptsRemaining(): number {
		return this._numberOfAttemptsRemaining;
	}

	@Output() backRoute: EventEmitter<any> = new EventEmitter();
	@Output() payNow: EventEmitter<any> = new EventEmitter();
	@Output() downloadManualPaymentForm: EventEmitter<any> = new EventEmitter();

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.isBackRoute = this.backRoute.observed;
	}

	onDownloadManualPaymentForm(): void {
		this.downloadManualPaymentForm.emit();
	}

	onKeyDownDownloadManualPaymentForm(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDownloadManualPaymentForm();
	}

	onPayNow(): void {
		this.payNow.emit();
	}

	onBack(): void {
		this.backRoute.emit();
	}
}
