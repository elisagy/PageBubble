import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
	selector: 'app',
	template: `<navbar></navbar>
    <router-outlet></router-outlet>
    <footer></footer>`
})
export class AppComponent {
	Router;

	static parameters = [Router];
	constructor(private router: Router) {
		this.Router = router;
		this.Router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                document.title = `Pagebubble${event.url.split('/')[1] ? ' | ' + event.url.split('/')[1].replace(/\-/g, ' ') : ''}`
            }
        });
	}
}
