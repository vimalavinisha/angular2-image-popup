/* 
 * @author Vimala A
 */

import {Component} from '@angular/core';
@Component({
    selector : 'my-app',
    template:  `
      <h2> Example - Default</h2>
      <p> you can directly access "ImageModel" directive for both listing thumbnails and popup images</p>

      <ImageModal [modalImages]="images"></ImageModal>
      <h2>  Example with thumbnail pointers </h2>
      <p> you can list images in your file and then calling "ImageModel" directive to show images on popup only</p>
      <div *ngFor="let img of images; let i= index"> 
        <div class="float-left" *ngIf="i <= 2" >
          <a class="more" *ngIf="i==2" (click)="OpenImageModel(img.img,images)"> +{{images.length - 3}} more </a> 
          <img class="list-img" src="{{img.thumb}}"(click)="OpenImageModel(img.img,images)" alt='Image' />
        </div>
      </div>
      <div *ngIf="openModalWindow">
        <ImageModal [modalImages]="images" [imagePointer] = "imagePointer" (cancelEvent) ="cancelImageModel()"></ImageModal>
      </div>
	`    
})
export class AppComponent {
  openModalWindow:boolean=false;
  imagePointer:number;
  images = [
    { thumb: './app/assets/images/gallery/thumbs/img1.jpg', img: './app/assets/images/gallery/img1.jpg', description: 'Image 1' },
    { thumb: './app/assets/images/gallery/thumbs/img2.jpg', img: './app/assets/images/gallery/img2.jpg', description: 'Image 2' },
    { thumb: './app/assets/images/gallery/thumbs/img3.jpg', img: './app/assets/images/gallery/img3.jpg', description: 'Image 3' },
    { thumb: './app/assets/images/gallery/thumbs/img4.jpg', img: './app/assets/images/gallery/img4.jpg', description: 'Image 4' },
    { thumb: './app/assets/images/gallery/thumbs/img5.jpg', img: './app/assets/images/gallery/img5.jpg', description: 'Image 5' }
  ];
  constructor() {

  }
 OpenImageModel(imageSrc,images) {
   var imageModalPointer;
   for (var i = 0; i < images.length; i++) {
          if (imageSrc === images[i].img) {
            imageModalPointer = i;
            break;
          }
     }
   this.openModalWindow = true;
   this.images = images;
   this.imagePointer  = imageModalPointer;
 }
 cancelImageModel() {
   this.openModalWindow = false;
 }
}
