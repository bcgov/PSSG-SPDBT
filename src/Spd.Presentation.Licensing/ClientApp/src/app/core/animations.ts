import { animate, style, transition, trigger } from '@angular/animations';

export const showHideTriggerAnimation = trigger('showHideTriggerAnimation', [
	transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
	transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
]);

export const showHideTriggerSlideAnimation = trigger('showHideTriggerSlideAnimation', [
	transition(':enter', [
		style({ opacity: 0, transform: 'translateX(-100%)' }), //apply default styles before animation starts
		animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
	]),
	transition(':leave', [
		style({ opacity: 1, transform: 'translateX(0)' }), //apply default styles before animation starts
		animate('500ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
	]),
]);
