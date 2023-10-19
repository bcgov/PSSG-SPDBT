import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	ApplyNameChangeDialogData,
	ApplyNameChangeModalComponent,
} from '../../components/apply-name-change-modal.component';

@Component({
	selector: 'app-step-licence-updates',
	template: `
		<section class="step-section p-3 pb-4">
			<div class="step">
				<app-step-title
					title="Update your Licence or Permit"
					subtitle="Making one or many of the following edits will incur a TOTAL $20 licence reprint fee"
					[showDivider]="true"
				></app-step-title>

				<div class="step-container">
					<div class="row">
						<div class="col-xxl-8 col-xl-9 col-lg-10 col-md-12 col-sm-12 mx-auto">
							<div class="fs-4 mb-2">Your update options:</div>
							<div class="fs-6 mb-2">You may update one or more the following.</div>
						</div>
					</div>
					<div class="row">
						<div class="offset-xxl-2 col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onApplyNameChange()">Apply your Updated Name</a>
								</li>
								<li class="my-2"><a color="primary" class="large my-2">Update your Photo</a></li>
							</ul>
						</div>

						<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul>
								<li class="my-2"><a color="primary" class="large my-2">Add a Licence Category</a></li>
								<li class="my-2">
									<a color="primary" class="large my-2">Add Request Authorization to Use Restraints</a>
								</li>
								<li class="my-2"><a color="primary" class="large my-2">Add Request Authorization to Use Dogs</a></li>
							</ul>
							<!-- <div class="my-2">
								<a color="primary" class="large my-2" (click)="onApplyNameChange()">Apply your Updated Name</a>
							</div>
							<div class="my-2"><a color="primary" class="large my-2">Update your Photo</a></div>
							<div class="my-2"><a color="primary" class="large my-2">Add a Licence Category</a></div>
							<div class="my-2">
								<a color="primary" class="large my-2">Add Request Authorization to Use Restraints</a>
							</div>
							<div class="my-2"><a color="primary" class="large my-2">Add Request Authorization to Use Dogs</a></div> -->
							<!-- <button mat-flat-button color="primary" class="large my-2">Apply your Updated Name</button>
							<button mat-flat-button color="primary" class="large my-2">Update your Photo</button>
							<button mat-flat-button color="primary" class="large my-2">Add a Licence Category</button> -->
							<!-- <button mat-flat-button color="primary" class="large my-2">
								Add Request Authorization to Use Restraints
							</button>
							<button mat-flat-button color="primary" class="large my-2">Add Request Authorization to Use Dogs</button> -->
						</div>
					</div>

					<div class="row">
						<div class="col-xxl-8 col-xl-9 col-lg-10 col-md-12 col-sm-12 mx-auto">
							<div class="fs-4 mt-3 mb-2">
								<mat-icon class="me-2">shopping_cart</mat-icon>
								Your updates:
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<div class="card-section mb-2 px-4 py-3" *ngFor="let update of updates; let i = index">
								<div class="row">
									<div class="col-lg-9 col-md-12">
										<div class="fs-6 fw-normal" style="color: var(--color-primary);">{{ update }}</div>
									</div>
									<div class="col-lg-3 col-md-12">
										<button mat-stroked-button>Remove</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			small {
				color: var(--color-grey-dark);
				line-height: 1.3em;
			}

			.text-data {
				font-weight: 500;
			}

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid #38598a;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class StepLicenceUpdatesComponent {
	updates: Array<string> = [];

	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {
		this.updates.push('Apply new name: Joanna Lee');
		this.updates.push('Add Licence Category: Locksmith');
		// this.updates.push('Add Licence Category: Private Investigator');
	}

	onClick(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Test',
			message: 'Test',
			actionText: 'Save',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
				}
			});
	}

	onApplyNameChange(): void {
		const dialogOptions: ApplyNameChangeDialogData = {};

		this.dialog
			.open(ApplyNameChangeModalComponent, {
				// width: '1400px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
				}
			});
	}
}
