/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {Component, OnDestroy} from '@angular/core';

import {Image, Action, ImageModalEvent, Description} from 'angular-modal-gallery';
import {Observable, Subscription} from "rxjs";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'my-app',
  styleUrls: ['./app/main.css'],
  template: `
    <section id="Images1">
      <h3>1 - Observable of images with delay(300)</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Observable&lt;Array&lt;Image&gt;&gt; with 300ms of delay (to simulate a network request)</li>
        <li>No downloadable images, because downloadable = false (showDownloadButton is false by default)</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <modalGallery [modalImages]="images"
                  [downloadable]="false"
                  [description]="customDescription"
                  (hasData)="onImageLoaded($event)"
                  (close)="onCloseImageModal($event)"
                  (show)="onVisibleIndex($event)"
                  (firstImage)="onIsFirstImage($event)"
                  (lastImage)="onIsLastImage($event)"></modalGallery>
    </section>
    <section id="Images2">
      <h3>2 - Observable of images with delay(300) + download (both 'ctrl+s' and button)</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Observable&lt;Array&lt;Image&gt;&gt; with 300ms of delay (to simulate a network request)</li>
        <li>downloadable images, because downloadable = true. So you can use ctrl+s to save the displayed image</li>
        <li>download button displayed because, showDownloadButton = true and downloadable is also = true</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <modalGallery [modalImages]="images"
                  [showDownloadButton]="true"
                  [downloadable]="true"  
                  (hasData)="onImageLoaded($event)"
                  (close)="onCloseImageModal($event)"
                  (show)="onVisibleIndex($event)"
                  (firstImage)="onIsFirstImage($event)"
                  (lastImage)="onIsLastImage($event)"></modalGallery>
    </section>
    <section id="Images3">
      <h3>3 - Array of images + download (both 'ctrl+s' and button)</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Array&lt;Image&gt;</li>
        <li>downloadable images, because downloadable = true. So you can use ctrl+s to save the displayed image</li>
        <li>download button displayed because, showDownloadButton = true and downloadable is also = true</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <modalGallery [modalImages]="imagesArray"
                  [showDownloadButton]="true"
                  [downloadable]="true" 
                  [description]="customFullDescription"
                  (hasData)="onImageLoaded($event)"
                  (close)="onCloseImageModal($event)"
                  (show)="onVisibleIndex($event)"
                  (firstImage)="onIsFirstImage($event)"
                  (lastImage)="onIsLastImage($event)"></modalGallery>
    </section>
    <section id="Images4">
      <br>
      <h3>4 - Observable of images with a single element and without a delay</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Observable&lt;Array&lt;Image&gt;&gt; without delay</li>
        <li>no downloadable, because both showDownloadButton and downloadable are false by default</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <!-- both showDownloadButton and downloadable are false by default -->
      <modalGallery [modalImages]="singleImage"
                  (hasData)="onImageLoaded($event)"
                  (close)="onCloseImageModal($event)"
                  (show)="onVisibleIndex($event)"
                  (firstImage)="onIsFirstImage($event)"
                  (lastImage)="onIsLastImage($event)"></modalGallery>
    </section>
    <section id="Images5">
      <br>
      <h3>5 - Array with thumbnail pointers + download (only 'ctrl+s', without button)</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Array&lt;Image&gt;</li>
        <li>imagePointer as input</li>
        <li>downloadable images only using ctrl+s, because both downloadable = true, but showDownloadButton is false by default</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <div *ngFor="let img of imagesArray; let i = index">
        <div class="float-left" *ngIf="i <= 2">
          <a class="more" *ngIf="i==2" (click)="openImageModal(img)"> +{{imagesArray.length - 3}} more </a>
          <img *ngIf="img.thumb" class="list-img" src="{{img.thumb}}" (click)="openImageModal(img)" alt='{{img.description}}'/>
          <img *ngIf="!img.thumb" class="list-img" src="{{img.img}}" (click)="openImageModal(img)" alt='{{img.description}}'/>
        </div>
      </div>
      <div *ngIf="openModalWindow">
        <modalGallery [modalImages]="imagesArray"
                    [imagePointer]="imagePointer"
                    [downloadable]="true"
                    (hasData)="onImageLoaded($event)"
                    (close)="onCloseImageModal($event)"
                    (show)="onVisibleIndex($event)"
                    (firstImage)="onIsFirstImage($event)"
                    (lastImage)="onIsLastImage($event)"></modalGallery>
      </div>
    </section>
    <br><br>
    <section id="Images6">
      <br>
      <h3>6 - Observable with thumbnail pointers + download (only 'ctrl+s', without button)</h3>
      <p>imageModal with</p>
      <ul>
        <li>modalImages is an Observable&lt;Array&lt;Image&gt;&gt; with 300ms of delay (to simulate a network request)</li>
        <li>imagePointer as input</li>
        <li>downloadable images only using ctrl+s, because both downloadable = true, but showDownloadButton is false by default</li>
        <li>Subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>
      </ul>
      <br>
      <div *ngFor="let img of images | async; let i = index">
        <div class="float-left" *ngIf="i <= 2">
          <a class="more" *ngIf="i==2" (click)="openImageModalObservable(img)"> +{{(images | async)?.length - 3}}
            more </a>
          <img *ngIf="img.thumb" class="list-img" src="{{img.thumb}}" (click)="openImageModalObservable(img)" alt='{{img.description}}'/>
          <img *ngIf="!img.thumb" class="list-img" src="{{img.img}}" (click)="openImageModalObservable(img)" alt='{{img.description}}'/>
        </div>
      </div>
      <div *ngIf="openModalWindowObservable">
        <modalGallery [modalImages]="images"
                    [imagePointer]="imagePointerObservable"
                    [downloadable]="true"
                    (hasData)="onImageLoaded($event)"
                    (close)="onCloseImageModal($event)"
                    (show)="onVisibleIndex($event)"
                    (firstImage)="onIsFirstImage($event)"
                    (lastImage)="onIsLastImage($event)"></modalGallery>
      </div>
    </section>
  `
})
export class AppComponent implements OnDestroy {

  openModalWindow: boolean = false;
  imagePointer: number = 0;

  openModalWindowObservable: boolean = false;
  imagePointerObservable: number = 0;

  imagesArray = [
    new Image(
      './app/assets/images/gallery/img1.jpg'
      // no description
      // no thumb
    ),
    new Image(
      './app/assets/images/gallery/img2.jpg',
      'Description 2'
      // no thumb
    ),
    new Image(
      './app/assets/images/gallery/img3.jpg',
      'Description 3',
      './app/assets/images/gallery/thumbs/img3.jpg'
    ),
    new Image(
      './app/assets/images/gallery/img4.jpg',
      'Description 4'
      // no thumb
    ),
    new Image(
      './app/assets/images/gallery/img5.jpg',
      null, // no description
      './app/assets/images/gallery/thumbs/img5.jpg'
    )
  ];

  // observable of an array of images with a delay to simulate a network request
  images: Observable<Array<Image>> = Observable.of(this.imagesArray).delay(300);

  // array with a single image inside (the first one)
  singleImage: Observable<Array<Image>> = Observable.of([
    new Image(
      './app/assets/images/gallery/img1.jpg',
      'Description 1',
      './app/assets/images/gallery/thumbs/img1.jpg'
    )]
  );

  customDescription: Description = {
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customFullDescription: Description = {
    // you should build this value programmaticaly with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image',
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  // rxjs subscription for example 5
  private subscription: Subscription;

  openImageModal(image: Image) {
    this.imagePointer = this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  openImageModalObservable(image: Image) {
    this.subscription = this.images.subscribe((val: Image[]) => {
      this.imagePointer = val.indexOf(image);
      this.openModalWindow = true;
    });
  }

  onImageLoaded(event: ImageModalEvent) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log("onImageLoaded action: " + Action[event.action]);
    console.log("onImageLoaded result:" + event.result);
  }

  onVisibleIndex(event: ImageModalEvent) {
    this.customFullDescription.customFullDescription = `Custom description of visible image with index= ${event.result}`;
    console.log("action: " + Action[event.action]);
    console.log("result:" + event.result);
  }

  onIsFirstImage(event: ImageModalEvent) {
    console.log("onfirst action: " + Action[event.action]);
    console.log("onfirst result:" + event.result);
  }

  onIsLastImage(event: ImageModalEvent) {
    console.log("onlast action: " + Action[event.action]);
    console.log("onlast result:" + event.result);
  }

  onCloseImageModal(event: ImageModalEvent) {
    console.log("onClose action: " + Action[event.action]);
    console.log("onClose result:" + event.result);
    this.openModalWindow = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
