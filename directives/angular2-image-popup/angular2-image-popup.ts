import {Component, Input, Output, ElementRef, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'ImageModal',
  template: `
   <div class="ng-gallery" *ngIf="showRepeat"> 
     <div *ngFor ="let i of modalImages; let index = index">
       <img src="{{ i.thumb }}" class="ng-thumb" (click)="openGallery(index)" alt="Image {{ index + 1 }}" />
      </div>
   </div>
   <div class="ng-overlay" *ngIf="opened">
    <div class="ng-gallery-content" >
    <div class="uil-ring-css" *ngIf="loading"><div></div></div>         
    <a class="close-popup" (click)="closeGallery()"><i class="fa fa-close"></i></a>
     <a class="nav-left" *ngIf="modalImages.length >1" (click)="prevImage()"><i class="fa fa-angle-left"></i></a>
     <img *ngIf="!loading" src="{{imgSrc}}" (click)="nextImage()" class="effect" />
     <a class="nav-right" *ngIf="modalImages.length >1" (click)="nextImage()"><i class="fa fa-angle-right"></i></a>
     <span class="info-text">{{ currentImageIndex + 1 }}/{{ modalImages.length }} - Image {{currentImageIndex+1}}</span>
   </div>
   </div>
       `
})
export class ImageModal implements OnInit {
  public _element: any;
  public opened: boolean = false;
  public imgSrc: string;
  public currentImageIndex: number = 0;
  public loading: boolean = false;
  public showRepeat: boolean = false;
  @Input('modalImages') public modalImages: any;
  @Input('imagePointer') public imagePointer: number;
  @Output('cancelEvent') cancelEvent = new EventEmitter<any>();

  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  ngOnInit() {
    console.log("this.currentImageIndex oninit: " + this.currentImageIndex);
    this.loading = true;
    if (this.imagePointer >= 0) {
      this.showRepeat = false;
      this.openGallery(this.imagePointer);
    } else {
      this.showRepeat = true;
    }
  }

  closeGallery() {
    console.log("this.currentImageIndex opengallery: " + this.currentImageIndex);
    this.opened = false;
    this.cancelEvent.emit(null);
  }

  prevImage() {
    console.log("this.currentImageIndex previmage: " + this.currentImageIndex);
    this.loading = true;
    this.currentImageIndex--;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.modalImages.length - 1;
    }
    this.openGallery(this.currentImageIndex);
  }

  nextImage() {
    console.log("this.currentImageIndex nextimage: " + this.currentImageIndex);
    this.loading = true;
    this.currentImageIndex++;
    if (this.modalImages.length === this.currentImageIndex) {
      this.currentImageIndex = 0;
    }
    this.openGallery(this.currentImageIndex);

  }

  openGallery(index) {
    console.log("index: " + index);
    // if (!index) {
    //   console.log("this.currentImageIndex if before: " + this.currentImageIndex);
    //   this.currentImageIndex = 1;
    //   console.log("this.currentImageIndex if after: " + this.currentImageIndex);
    // }
    console.log("this.currentImageIndex before: " + this.currentImageIndex);
    this.currentImageIndex = index;
    console.log("this.currentImageIndex after: " + this.currentImageIndex);
    this.opened = true;
    this.imgSrc = this.modalImages[this.currentImageIndex].img;
    this.loading = false;
  }
}
