import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
	selector: 'app-overlay-button',
	template: `<ng-content></ng-content>`,
	styles: [
		`
			:host {
				line-height: 0px;
			}
		`,
	],
})
export class DropdownOverlayButtonComponent {}

@UntilDestroy()
@Component({
	selector: 'app-dropdown-overlay',
	template: `
		<!-- This button triggers the overlay and is it's origin -->
		<button
			matTooltip="Apply filters"
			mat-icon-button
			(click)="toggleOverlay()"
			type="button"
			cdkOverlayOrigin
			#trigger="cdkOverlayOrigin"
		>
			<!-- This is the default button to be rendered if custom content is not provided -->
			<ng-template #defaultOverlayButton>
				<mat-icon
					[matBadge]="matBadgeShow ? '!' : ''"
					matBadgeColor="warn"
					[title]="label"
					[attr.aria-label]="label"
					class="filter-button"
					>{{ dropdownIcon }}</mat-icon
				>
			</ng-template>

			<ng-template #customOverlayButton>
				<ng-content select="app-overlay-button"></ng-content>
			</ng-template>

			<ng-container [ngTemplateOutlet]="overlayButton ? customOverlayButton : defaultOverlayButton"></ng-container>
		</button>

		<!-- This template displays the overlay content and is connected to the button -->
		<ng-template
			cdkConnectedOverlay
			[cdkConnectedOverlayOrigin]="trigger"
			[cdkConnectedOverlayOpen]="showDropdownOverlay"
			(overlayOutsideClick)="onOverlayOutsideClick()"
		>
			<ng-content></ng-content>
		</ng-template>
	`,
	styles: [
		`
			.filter-button {
				position: relative;
				top: -3px;
				left: -6px;
				font-size: 40px;
				height: 40px;
				width: 40px;
			}

			.mat-mdc-icon-button.mat-mdc-button-base {
				width: 52px;
				height: 52px;
			}
		`,
	],
})
export class DropdownOverlayComponent implements OnInit {
	@Input() dropdownIcon = 'filter_list';
	@Input() matBadgeShow = false;

	@Input() closeWhenClickOutside = false;
	@Input() showDropdownOverlay = false;
	@Input() label = 'Apply filters';
	@Input() icon = '';

	@ContentChild(DropdownOverlayButtonComponent) overlayButton!: TemplateRef<DropdownOverlayButtonComponent>;

	@Output() showDropdownOverlayChange = new EventEmitter();

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.router.events.pipe(untilDestroyed(this)).subscribe(() => {
			if (this.showDropdownOverlay) this.showDropdownOverlay = false;
		});
	}

	toggleOverlay() {
		this.showDropdownOverlay = !this.showDropdownOverlay;
		this.showDropdownOverlayChange.emit(this.showDropdownOverlay);
	}

	onOverlayOutsideClick() {
		if (!this.closeWhenClickOutside) return;

		this.toggleOverlay();
	}
}
