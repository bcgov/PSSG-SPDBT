import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInfo } from 'src/app/api/models';

export interface OrgSelectionDialogData {
	userInfos: Array<UserInfo>;
}
@Component({
	selector: 'app-org-selection-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-divider></mat-divider>
		<mat-dialog-content>
			<ng-container *ngFor="let userinfo of userInfos; let i = index">
				<button mat-stroked-button color="primary" class="large my-2" (click)="onSelectOrg(userinfo)">
					{{ userinfo.orgName }}
				</button>
			</ng-container>
		</mat-dialog-content>
	`,
	styles: [],
})
export class OrgSelectionModalComponent implements OnInit {
	selectedOrg: any = null;
	userInfos: Array<UserInfo> = [];
	title: string = 'Organization selection';

	constructor(
		private dialogRef: MatDialogRef<OrgSelectionModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: OrgSelectionDialogData
	) {}

	ngOnInit(): void {
		const infos = this.dialogData.userInfos;
		const infoFiltered = infos.filter((v, i, a) => a.findIndex((v2) => v.orgId === v2.orgId) === i);
		infoFiltered.sort((a: UserInfo, b: UserInfo) => {
			const a1 = a.orgName?.toUpperCase() ?? '';
			const b1 = b.orgName?.toUpperCase() ?? '';
			return a1.localeCompare(b1);
		});
		this.userInfos = infoFiltered;
	}

	onSelectOrg(userinfo: UserInfo) {
		this.dialogRef.close({ ...userinfo });
	}
}
