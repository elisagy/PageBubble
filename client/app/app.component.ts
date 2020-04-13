import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app',
    template: `<navbar *ngIf="showNavbarAndfooter()"></navbar>
    <router-outlet></router-outlet>
    <footer *ngIf="showNavbarAndfooter()"></footer>`
})
export class AppComponent {
	Router;

	static parameters = [Router];
	constructor(private router: Router) {
		this.Router = router;
	}

	showNavbarAndfooter() {
		return !this.Router.url.match(/^\/webpage\-details/);
	}
}
