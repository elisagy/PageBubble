import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { SocketService } from '../../components/socket/socket.service';

interface Webpage {
    title?: string;
    url: string;
    origin: string;
    updatedAt: Date;
    followingWebpages: [Webpage],
    followingWebpagesFromDifferentOrigin: [Webpage]
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
    showAllFollowingWebpages: Boolean = false;

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
                this.showAllFollowingWebpages = (webpage.followingWebpages || []).length > (webpage.followingWebpagesFromDifferentOrigin || []).length;
                // this.SocketService.syncUpdates('webpage', this.webpage);
            }));
    }


    ngOnDestroy() {
        // this.SocketService.unsyncUpdates('webpage');
    }

    unsafeImageUrl(imageUrl) {
        return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    isSameOriginSelectionDisabled() {
        return this.webpage && (this.webpage.followingWebpages && !this.webpage.followingWebpages.length ||
            this.webpage.followingWebpagesFromDifferentOrigin && !this.webpage.followingWebpagesFromDifferentOrigin.length ||
            _.isEqual(this.webpage.followingWebpages, this.webpage.followingWebpagesFromDifferentOrigin));

    }
}
