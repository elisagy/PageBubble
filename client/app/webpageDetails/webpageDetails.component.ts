import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SocketService } from '../../components/socket/socket.service';

interface Webpage {
    title?: string;
    url: string;
    updatedAt: Date;
    followingWebpages: [Webpage]
}

@Component({
    selector: 'webpageDetails',
    template: require('./webpageDetails.html'),
    styles: [require('./webpageDetails.scss')],
})
export class WebpageDetailsComponent implements OnInit, OnDestroy {
    SocketService;
    Route;
    webpage: Webpage;

    static parameters = [HttpClient, SocketService, ActivatedRoute, DomSanitizer];
    constructor(private http: HttpClient, private socketService: SocketService, private route: ActivatedRoute, private domSanitizer: DomSanitizer) {
        this.http = http;
        this.SocketService = socketService;
        this.Route = route;
    }

    ngOnInit() {
        return this.route.params.subscribe(params => this.http.get(`/api/webpages/${encodeURIComponent(params.url)}`)
            .subscribe((webpage: Webpage) => {
                this.webpage = webpage;
                // this.SocketService.syncUpdates('webpage', this.webpage);
            }));
    }


    ngOnDestroy() {
        // this.SocketService.unsyncUpdates('webpage');
    }

    unsafeImageUrl(imageUrl) {
        return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }
}
