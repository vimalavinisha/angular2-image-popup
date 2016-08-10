Angular2 image popup
=========

The sources for this package are in (https://github.com/vimalavinisha/angular2-image-popup) repo. Please file issues and pull requests against this repo.

## Demo Output
  ![angular2-image-popup](https://cloud.githubusercontent.com/assets/11042288/16330239/78a57df6-3a05-11e6-98b9-7414c0eaf794.png)
  ![popup](https://cloud.githubusercontent.com/assets/11042288/16330244/861f3cc4-3a05-11e6-8757-7baf315eda8c.png)
##Usage
    node install
      npm install angular2-image-popup
    bower install
      bower install image-popup
###1.In index.html page include following css 
      <link rel="stylesheet" type="text/css" href="directives/angular2-image-popup/css/style.css">
      <link rel="stylesheet" type="text/css" href="node_modules/font-awesome/css/font-awesome.css">
      <link rel="stylesheet" type="text/css" href="app/assets/css/main.css">
###2.component file use like below
      import {Component} from '@angular/core';
      import {ImageModal} from '../directives/angular2-image-popup/image-modal-popup';
      @Component({
          selector : 'my-app',
          directives: [ImageModal],
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
         //alert('OpenImages');
         var imageModalPointer;
         for (var i = 0; i < images.length; i++) {
                if (imageSrc === images[i].img) {
                  imageModalPointer = i;
                  console.log('jhhl',i);
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
