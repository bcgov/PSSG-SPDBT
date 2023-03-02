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
		<button mat-fab (click)="toggleOverlay()" type="button" cdkOverlayOrigin #trigger="cdkOverlayOrigin">
			<!-- This is the default button to be rendered if custom content is not provided -->
			<ng-template #defaultOverlayButton>
				<mat-icon [title]="label" [attr.aria-label]="label" style="position: relative; top: 3px;">{{
					dropdownIcon
				}}</mat-icon>
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
	styles: [],
})
export class DropdownOverlayComponent implements OnInit {
	@Input() dropdownIcon = 'tunes';

	@Input() closeWhenClickOutside = false;
	@Input() showDropdownOverlay = false;
	@Input() label = '';
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
