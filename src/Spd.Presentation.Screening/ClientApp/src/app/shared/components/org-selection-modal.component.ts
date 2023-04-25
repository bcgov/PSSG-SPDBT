import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInfo } from 'src/app/api/models';

export interface OrgSelectionDialogData {
	userInfos: Array<UserInfo>;
}

export interface OrgSelectionResponseData {
	orgId: string | null;
	orgName: string | null;
	userId: string | null;
}

@Component({
	selector: 'app-org-selection-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-divider></mat-divider>
		<mat-dialog-content>
			<mat-radio-group [(ngModel)]="selectedOrg">
				<ng-container *ngFor="let user of userInfos; let i = index">
					<mat-radio-button [value]="user.orgId" [name]="user.orgId!">
						<strong>{{ user.orgName }}</strong>
					</mat-radio-button>
				</ng-container>
			</mat-radio-group>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="offset-lg-9 col-lg-3 offset-md-8 col-md-4 col-sm-12 mb-2">
					<button mat-raised-button color="primary" *ngIf="selectedOrg" class="large" (click)="onSaveOrg()">
						Select
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			.button-toggle {
				width: 130px;
			}

			.delete-row-button:not([disabled]) {
				color: var(--color-red);
			}
		`,
	],
})
export class OrgSelectionModalComponent implements OnInit {
	selectedOrg: any = null;
	userInfos: Array<UserInfo> = [];
	title: string = 'Organization Selection';

	constructor(
		private dialogRef: MatDialogRef<OrgSelectionModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: OrgSelectionDialogData
	) {}

	ngOnInit(): void {
		const infos = this.dialogData.userInfos;
		infos.sort((a: UserInfo, b: UserInfo) => {
			const a1 = a.orgName?.toUpperCase() ?? '';
			const b1 = b.orgName?.toUpperCase() ?? '';
			return a1.localeCompare(b1);
		});
		this.userInfos = infos;
	}

	onSaveOrg() {
		const userinfo = this.userInfos.find((item) => item.orgId == this.selectedOrg);
		this.dialogRef.close({
			orgId: userinfo ? userinfo.orgId : null,
			orgName: userinfo ? userinfo.orgName : null,
			userId: userinfo ? userinfo.userId : null,
		});
	}
}
