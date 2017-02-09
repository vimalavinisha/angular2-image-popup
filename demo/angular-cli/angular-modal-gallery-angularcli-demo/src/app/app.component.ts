/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

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

import {Image, Action, ImageModalEvent} from 'angular-modal-gallery';
import {Observable, Subscription} from "rxjs";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  // used by example 4
  openModalWindow: boolean = false;
  imagePointer: number = 0;

  // used by example 5
  openModalWindowObservable: boolean = false;
  imagePointerObservable: number = 0;

  // used by both examples 2 and 4
  imagesArray = [
    new Image(
      '../assets/images/gallery/thumbs/img1.jpg',
      '../assets/images/gallery/img1.jpg',
      'Image 1'
    ),
    new Image(
      '../assets/images/gallery/thumbs/img2.jpg',
      '../assets/images/gallery/img2.jpg',
      'Image 2'
    ),
    new Image(
      '../assets/images/gallery/thumbs/img3.jpg',
      '../assets/images/gallery/img3.jpg',
      'Image 3'
    ),
    new Image(
      '../assets/images/gallery/thumbs/img4.jpg',
      '../assets/images/gallery/img4.jpg',
      'Image 4'
    ),
    new Image(
      '../assets/images/gallery/thumbs/img5.jpg',
      '../assets/images/gallery/img5.jpg',
      'Image 5'
    )
  ];

  // used by both examples 1 and 5
  // observable of an array of images with a delay to simulate a network request
  images: Observable<Array<Image>> = Observable.of(this.imagesArray).delay(300);

  // used by example 3
  // array with a single image inside (the first one)
  singleImage: Observable<Array<Image>> = Observable.of([
    new Image(
      '../assets/images/gallery/thumbs/img1.jpg',
      '../assets/images/gallery/img1.jpg',
      'Image 1'
    )]
  );

  // rxjs subscription for example 5
  private subscription: Subscription;

  // used by example 4
  openImageModal(image: Image) {
    this.imagePointer = this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  // used by example 5
  openImageModalObservable(image: Image) {
    this.images.subscribe((val: Image[]) => {
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

  // release resources for example 5
  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
