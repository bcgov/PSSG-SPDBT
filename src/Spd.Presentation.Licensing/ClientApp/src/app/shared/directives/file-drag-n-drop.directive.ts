import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[fileDragDrop]',
})
export class FileDragNDropDirective {
	@Output() private filesChangeEmitter: EventEmitter<File> = new EventEmitter();

	@HostBinding('style.background') private background = '';
	@HostBinding('style.border') private borderStyle = '2px dashed';
	@HostBinding('style.border-color') private borderColor = '#003366';
	@HostBinding('style.border-radius') private borderRadius = '5px';

	constructor() {}

	@HostListener('dragover', ['$event']) public onDragOver(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = 'lightgray';
		this.borderColor = '#fcba19';
		this.borderStyle = '3px solid';
	}

	@HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.setDefaults();
	}

	@HostListener('drop', ['$event']) public onDrop(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.setDefaults();
		// debugger;
		const files = evt.dataTransfer.files;
		const valid_files: Array<File> = files;
		if (valid_files.length > 0) {
			this.filesChangeEmitter.emit(valid_files[0]);
		}
	}

	private setDefaults() {
		this.background = '';
		this.borderColor = '#003366';
		this.borderStyle = '2px dashed';
	}
}
