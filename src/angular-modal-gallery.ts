import { OnInit, Input, Output, EventEmitter, HostListener, Component } from '@angular/core';

@Component({
    selector: 'ImageModal',
    exportAs: 'ImageModal',
    styleUrls: ['./main.css', './style.css'],
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
     <img *ngIf="!loading" src="{{ imgSrc }}" (click)="nextImage()" class="effect" />
     <a class="nav-right" *ngIf="modalImages.length >1" (click)="nextImage()"><i class="fa fa-angle-right"></i></a>
     <span class="info-text">{{ currentImageIndex + 1 }}/{{ modalImages.length }} - Image {{ currentImageIndex+1 }}</span>
   </div>
   </div>
       `
})
export class AngularModalGallery implements OnInit {
    opened: boolean = false;
    imgSrc: string;
    currentImageIndex: number = 0;
    loading: boolean = false;
    showRepeat: boolean = false;

    @Input() modalImages: any;
    @Input() imagePointer: number;
    @Output() cancelEvent = new EventEmitter<any>();

    @HostListener('window:keydown', ['$event']) onKeyDown(e: any) {
        if (!this.opened) {
            return;
        }
        if (e.keyCode === 27) { // esc
            this.closeGallery();
        }
        if (e.keyCode === 37) { // left
            this.prevImage();
        }
        if (e.keyCode === 39) { // right
            this.nextImage();
        }
    }

    ngOnInit() {
        this.loading = true;
        if (this.imagePointer >= 0) {
            this.showRepeat = false;
            this.openGallery(this.imagePointer);
        } else {
            this.showRepeat = true;
        }
    }

    closeGallery() {
        this.opened = false;
        this.cancelEvent.emit(null);
    }

    prevImage() {
        this.loading = true;
        this.currentImageIndex = this.prevIndex(this.currentImageIndex);
        this.openGallery(this.currentImageIndex);
    }

    nextImage() {
        this.loading = true;
        this.currentImageIndex = this.nextIndex(this.currentImageIndex);
        this.openGallery(this.currentImageIndex);
    }

    openGallery(index: number) {
        this.currentImageIndex = index;
        this.opened = true;
        this.imgSrc = this.modalImages[this.currentImageIndex].img;
        this.loading = false;
    }

    private nextIndex(index: number) {
        // -2   -1  -1
        // -1   0   0
        //  0   1   1
        //  1   2   2
        //  2   3   0  (modalImages.length == 3 for instance)
        //  3   4   4
        //  4   5   5
        //  5   6   6
        //  6   7   7
        index++;
        if (index)
            if (this.modalImages.length === index) {
                index = 0;
            }
        return index;
    }

    private prevIndex(index: number) {
        // -2   -3  2
        // -1   -2  2
        //  0   -1  2
        //  1   0   0
        //  2   1   1  (modalImages.length == 3 for instance)
        //  3   2   2
        //  4   3   3
        //  5   4   4
        //  6   5   5
        index--;
        if (index < 0) {
            index = this.modalImages.length - 1;
        }
        return index;
    }
}
