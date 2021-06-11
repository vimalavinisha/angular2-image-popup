/*
 The MIT License (MIT)

 Copyright (c) 2017-2021 Stefano Cappa (Ks89)

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

import { Component } from '@angular/core';

import { Image } from '@ks89/angular-modal-gallery';
import { CarouselExampleComponent } from '../carousel/carousel.component';

@Component({
  selector: 'ks-carousel-ie11-page',
  templateUrl: './carousel-ie11.html',
  styleUrls: ['./carousel-ie11.scss']
})
export class CarouselIe11ExampleComponent {
  imagesRect: Image[] = [
    new Image(
      0,
      {
        img: '/assets/images/gallery/milan-pegasus-gallery-statue.jpg',
        description: 'Description 1'
      },
      {
        img: '/assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg',
        title: 'First image title',
        alt: 'First image alt',
        ariaLabel: 'First image aria-label'
      }
    ),
    new Image(1, { img: '/assets/images/gallery/pexels-photo-47223.jpeg' }, { img: '/assets/images/gallery/thumbs/t-pexels-photo-47223.jpg' }),
    new Image(
      2,
      {
        img: '/assets/images/gallery/pexels-photo-52062.jpeg',
        description: 'Description 3',
        title: 'Third image title',
        alt: 'Third image alt',
        ariaLabel: 'Third image aria-label'
      },
      {
        img: '/assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
        description: 'Description 3'
      }
    ),
    new Image(
      3,
      {
        img: '/assets/images/gallery/pexels-photo-66943.jpeg',
        description: 'Description 4',
        title: 'Fourth image title (modal obj)',
        alt: 'Fourth image alt (modal obj)',
        ariaLabel: 'Fourth image aria-label (modal obj)'
      },
      {
        img: '/assets/images/gallery/thumbs/t-pexels-photo-66943.jpg',
        title: 'Fourth image title (plain obj)',
        alt: 'Fourth image alt (plain obj)',
        ariaLabel: 'Fourth image aria-label (plain obj)'
      }
    ),
    new Image(4, { img: '/assets/images/gallery/pexels-photo-93750.jpeg' }, { img: '/assets/images/gallery/thumbs/t-pexels-photo-93750.jpg' }),
    new Image(
      5,
      {
        img: '/assets/images/gallery/pexels-photo-94420.jpeg',
        description: 'Description 6'
      },
      { img: '/assets/images/gallery/thumbs/t-pexels-photo-94420.jpg' }
    ),
    new Image(6, { img: '/assets/images/gallery/pexels-photo-96947.jpeg' }, { img: '/assets/images/gallery/thumbs/t-pexels-photo-96947.jpg' })
  ];

  imagesRectNoTitles: Image[] = [
    new Image(
      0,
      { img: '../assets/images/gallery/milan-pegasus-gallery-statue.jpg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg', title: '' }
    ),
    new Image(
      1,
      { img: '../assets/images/gallery/pexels-photo-47223.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-47223.jpg', title: '' }
    ),
    new Image(
      2,
      { img: '../assets/images/gallery/pexels-photo-52062.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-52062.jpg', title: '' }
    ),
    new Image(
      3,
      { img: '../assets/images/gallery/pexels-photo-66943.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-66943.jpg', title: '' }
    ),
    new Image(
      4,
      { img: '../assets/images/gallery/pexels-photo-93750.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-93750.jpg', title: '' }
    ),
    new Image(
      5,
      { img: '../assets/images/gallery/pexels-photo-94420.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-94420.jpg', title: '' }
    ),
    new Image(
      6,
      { img: '../assets/images/gallery/pexels-photo-96947.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-96947.jpg', title: '' }
    )
  ];

  fallbackRectImages: Image[] = [
    new Image(0, {
      // this file is not available so the browser returns an error
      img: '../assets/images/gallery/UNEXISTING_IMG1.jpg',
      // because the img above doesn't exists, the library will use this file
      fallbackImg: '../assets/images/gallery/fallback-carousel1.jpg'
    }),
    new Image(1, {
      img: '../assets/images/gallery/UNEXISTING_IMG2.jpg',
      fallbackImg: '../assets/images/gallery/fallback-carousel2.jpg'
    }),
    new Image(
      2,
      {
        img: '../assets/images/gallery/UNEXISTING_IMG3.jpg',
        fallbackImg: '../assets/images/gallery/fallback-carousel3.jpg'
      },
      {
        img: '../assets/images/gallery/thumbs/UNEXISTING_IMG3.png',
        fallbackImg: '../assets/images/gallery/fallback-carousel3.jpg'
      }
    ),
    new Image(3, {
      img: '../assets/images/gallery/UNEXISTING_IMG4.jpg',
      fallbackImg: '../assets/images/gallery/fallback-carousel4.jpg'
    }),
    new Image(
      4,
      {
        img: '../assets/images/gallery/UNEXISTING_IMG5.jpg',
        fallbackImg: '../assets/images/gallery/fallback-carousel5.jpg'
      },
      {
        img: '../assets/images/gallery/thumbs/UNEXISTING_IMG5.jpg',
        fallbackImg: '../assets/images/gallery/fallback-carousel5.jpg'
      }
    )
  ];
}
