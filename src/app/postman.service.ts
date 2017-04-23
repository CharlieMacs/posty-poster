/**
 * Postman is one stop service for requesting things, including design lists, and design templates. 📸 🖨 🎆
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { ArtboardClass } from './artboard.class';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { DesignProperty, DesignProperties } from './interfaces';

import { config } from '../config';
import * as tool from './tools';

@Injectable()
export class PostmanService {

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getAllPacks(): Promise<any[]> {
        return this.http.get(`${config.designDataApi}/all-packs.json`)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getDesign(packID: string, designID: string, getHTML: boolean, getCSS: boolean ): Observable<any> {
        return Observable.forkJoin(

            // Get the json
            this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.json`).map((res: Response) => res.json()),

            // Get HTML if it's requested
            getHTML ? 
                this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.html`).map((res: Response) => res.text()) 
                : 
                Promise.resolve(null),

            // Get CSS if it's requested
            getHTML ? 
                this.http.get(`${config.designDataApi}/design-packs/${packID}.pack/${designID}.template.css`).map((res: Response) => res.text())
                :
                Promise.resolve(null)
        );
    }

    getDesignThumbnail(designID : string) : string {
        return `${config.designDataApi}/design-assets/thumbnails/${designID}.png`;
    }
}
