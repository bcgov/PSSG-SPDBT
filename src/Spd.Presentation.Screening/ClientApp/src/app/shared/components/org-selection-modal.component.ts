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
		  @for (userinfo of userInfos; track userinfo; let i = $index) {
		    <button mat-stroked-button color="primary" class="large my-2" (click)="onSelectOrg(userinfo)">
		      {{ userinfo.orgName }}
		    </button>
		  }
		</mat-dialog-content>
		`,
    styles: [],
    standalone: false
})
export class OrgSelectionModalComponent implements OnInit {
	selectedOrg: any = null;
	userInfos: Array<UserInfo> = [];
	title = 'Organization selection';

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

	onSelectOrg(userinfo: UserInfo) {
		this.dialogRef.close({ ...userinfo });
	}
}
