import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../components/auth/auth.service';
import { UserService } from '../auth/user.service';

var requestDataFromExtensionCallbacks = {};
function loadDataFromExtension(functionStr, cb) {
	var hash = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
	requestDataFromExtensionCallbacks[hash] = cb;
	window.top.postMessage(JSON.stringify({ functionStr, hash }), '*');
}
window.addEventListener('message', message => {
	if (message.source === window) {
		return;
	}

	var data = JSON.parse(message.data);
	requestDataFromExtensionCallbacks[data.hash](data.response);
});

@Component({
	selector: 'oauth-buttons',
	template: require('./oauth-buttons.html'),
	styles: [require('./oauth-buttons.scss')],
})
export class OauthButtonsComponent {
	AuthService;
	UserService;
	Router;

	static parameters = [AuthService, UserService, Router];
	constructor(_AuthService_: AuthService, private userService: UserService, router: Router) {
		this.AuthService = _AuthService_;
		this.UserService = userService;
		this.Router = router;
	}

	loginOauth(provider) {
		if (window.self === window.top) {
			window.location.href = `/auth/${provider}`;
		}
		else {
			switch (provider) {
				case 'google-api':
					loadDataFromExtension('getAuthToken', authToken => {
						localStorage.setItem('id_token', authToken);
						this.UserService.get().toPromise()
							.then(user => {
								localStorage.setItem('user', JSON.stringify(user));
								window.location.href = this.AuthService.getPathname();
							});
					});
					break;

				default:
					break;
			}
		}
	}
}
