import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';

import { WebpageDetailsComponent } from './webpageDetails.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'webpage-details/:url', component: WebpageDetailsComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
    ],
    declarations: [
        WebpageDetailsComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        WebpageDetailsComponent,
    ],
})
export class WebpageDetailsModule {}
