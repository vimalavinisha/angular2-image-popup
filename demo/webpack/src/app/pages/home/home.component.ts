import { Component } from '@angular/core';

@Component({
  selector: 'mmw-home-page',
  styleUrls: ['home.scss'],
  templateUrl: 'home.html'
})
export class HomeComponent {

  constructor() {}

  openModalWindow: boolean = false;
  imagePointer: number;
  images = [
    {
      thumb: 'assets/images/gallery/thumbs/img1.jpg',
      img: 'assets/images/gallery/img1.jpg',
      description: 'Image test 1'
    },
    {
      thumb: 'assets/images/gallery/thumbs/img2.jpg',
      img: 'assets/images/gallery/img2.jpg',
      description: 'Image test 2'
    },
    {
      thumb: 'assets/images/gallery/thumbs/img3.jpg',
      img: 'assets/images/gallery/img3.jpg',
      description: 'Image test 3'
    },
    {
      thumb: 'assets/images/gallery/thumbs/img4.jpg',
      img: 'assets/images/gallery/img4.jpg',
      description: 'Image test 4'
    },
    {
      thumb: 'assets/images/gallery/thumbs/img5.jpg',
      img: 'assets/images/gallery/img5.jpg',
      description: 'Image test 5'
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

  cancelImageModal(isCancelled: boolean) {
    console.log(`isCancelled: ${isCancelled}`); // requires angular-modal-gallery 3.x.x or greater
    this.openModalWindow = false;
  }
}
