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

import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  styleUrls: ['./app/main.css'],
  template: `
      <h2> Example - Default</h2>
      <p> you can directly access "ImageModal" directive for both listing thumbnails and popup images</p>

      <imageModal [modalImages]="images"></imageModal>
      <h2>  Example with thumbnail pointers </h2>
      <p> you can list images in your file and then calling "ImageModal" directive to show images on popup only</p>
      <div *ngFor="let img of images; let i= index"> 
        <div class="float-left" *ngIf="i <= 2" >
          <a class="more" *ngIf="i==2" (click)="openImageModal(img.img, images)"> +{{images.length - 3}} more </a> 
          <img class="list-img" src="{{img.thumb}}"(click)="openImageModal(img.img, images)" alt='Image' />
        </div>
      </div>
      <div *ngIf="openModalWindow">
        <imageModal [modalImages]="images" [imagePointer] = "imagePointer" (cancelEvent) ="cancelImageModal()"></imageModal>
      </div>
	`
})
export class AppComponent {

  openModalWindow: boolean = false;
  imagePointer: number;
  images = [
    {
      thumb: './app/assets/images/gallery/thumbs/img1.jpg',
      img: './app/assets/images/gallery/img1.jpg',
      description: 'Image 1'
    },
    {
      thumb: './app/assets/images/gallery/thumbs/img2.jpg',
      img: './app/assets/images/gallery/img2.jpg',
      description: 'Image 2'
    },
    {
      thumb: './app/assets/images/gallery/thumbs/img3.jpg',
      img: './app/assets/images/gallery/img3.jpg',
      description: 'Image 3'
    },
    {
      thumb: './app/assets/images/gallery/thumbs/img4.jpg',
      img: './app/assets/images/gallery/img4.jpg',
      description: 'Image 4'
    },
    {
      thumb: './app/assets/images/gallery/thumbs/img5.jpg',
      img: './app/assets/images/gallery/img5.jpg',
      description: 'Image 5'
    }
  ];

  openImageModal(imageSrc, images) {
    let imageModalPointer;
    for (let i = 0; i < images.length; i++) {
      if (imageSrc === images[i].img) {
        imageModalPointer = i;
        break;
      }
    }
    this.openModalWindow = true;
    this.images = images;
    this.imagePointer = imageModalPointer;
  }

  cancelImageModal() {
    this.openModalWindow = false;
  }
}
