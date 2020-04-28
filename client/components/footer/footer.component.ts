import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'footer',
    template: require('./footer.html'),
    styles: [require('./footer.scss')]
})
export class FooterComponent implements OnInit {
	thisYear: Number;

	ngOnInit() {
		this.thisYear = (new Date()).getFullYear();
	}
}
