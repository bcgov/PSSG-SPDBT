import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';

@Component({
	selector: 'app-security-worker-licence-category',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="What category of Security Worker Licence are you applying for?"
					subtitle="You can add up to a total of 6 categories"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="offset-xl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Category</mat-label>
								<mat-select [(ngModel)]="category">
									<mat-option *ngFor="let item of categoryListOfValues" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
							<button
								mat-stroked-button
								color="primary"
								class="large my-2"
								*ngIf="categoryList.length < 6"
								(click)="onAddCategory()"
							>
								Add Category
							</button>
						</div>
					</div>

					<div class="row">
						<div class="offset-xl-2 col-xl-9 col-lg-12">
							<mat-accordion multi="false">
								<mat-expansion-panel class="my-3" [expanded]="true" *ngFor="let item of categoryList; let i = index">
									<mat-expansion-panel-header>
										<mat-panel-title>
											<mat-chip-listbox class="me-4">
												<mat-chip-option [selectable]="false" class="mat-chip-green"> {{ i + 1 }} </mat-chip-option>
											</mat-chip-listbox>
											<span class="title" style="white-space:nowrap">{{ item.desc }}</span>
											<button
												mat-flat-button
												class="w-auto ms-4"
												style="color: var(--color-red);"
												aria-label="Remove"
												(click)="onRemove(i)"
											>
												<mat-icon>delete_outline</mat-icon>
											</button>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="row mb-2">
										<div class="col-12 mx-auto">
											<mat-checkbox checked="true">
												{{ item.desc }}
											</mat-checkbox>
										</div>
									</div>
								</mat-expansion-panel>
							</mat-accordion>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class SecurityWorkerLicenceCategoryComponent {
	category = '';
	categoryList: any[] = [];
	categoryListOfValues: SelectOptions[] = [
		{ desc: 'Security Guard', code: 'aaa' },
		{ desc: 'Security Guard - Under Supervision', code: 'bbb' },
		{ desc: 'Armoured Car Guard', code: 'ccc' },
		{ desc: 'Electronic Locking Device Installer', code: 'ddd' },
		{ desc: 'Security Alarm Installer - Under Supervision', code: 'eee' },
		{ desc: 'Security Alarm Installer', code: 'fff' },
		{ desc: 'Security Alarm Monitor', code: 'ggg' },
		{ desc: 'Security Alarm Response', code: 'hhh' },
		{ desc: 'Security Alarm Sales', code: 'iii' },
		{ desc: 'Closed Circuit Television Installer', code: 'jjj' },
		{ desc: 'Locksmith - Under Supervision', code: 'kkk' },
		{ desc: 'Locksmith', code: 'lll' },
		{ desc: 'Private Investigator - Under Supervision', code: 'mmm' },
		{ desc: 'Private Investigator', code: 'nnn' },
		{ desc: 'Security Consultant', code: 'ooo' },
		{ desc: 'Body Armour Sales', code: 'ppp' },
	];

	constructor(private dialog: MatDialog, private hotToast: HotToastService) {}

	onAddCategory(): void {
		if (this.category) {
			const isFound = this.categoryList.find((item) => item.code == this.category);
			if (isFound) {
				this.hotToast.error(`'${isFound.desc}' has already been added`);
				return;
			}

			const option = this.categoryListOfValues.find((item) => item.code == this.category)!;
			this.categoryList.push({ code: option?.code, desc: option.desc });
		}
	}

	onRemove(i: any) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this category?',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.categoryList.splice(i, 1);
				}
			});
	}
}
