import { Input, Output, EventEmitter, HostListener, Component } from '@angular/core';
export var AngularModalGallery = (function () {
    function AngularModalGallery() {
        this.opened = false;
        this.currentImageIndex = 0;
        this.loading = false;
        this.showRepeat = false;
        this.cancelEvent = new EventEmitter();
    }
    AngularModalGallery.prototype.onKeyDown = function (e) {
        if (!this.opened) {
            return;
        }
        if (e.keyCode === 27) {
            this.closeGallery();
        }
        if (e.keyCode === 37) {
            this.prevImage();
        }
        if (e.keyCode === 39) {
            this.nextImage();
        }
    };
    AngularModalGallery.prototype.ngOnInit = function () {
        this.loading = true;
        if (this.imagePointer >= 0) {
            this.showRepeat = false;
            this.openGallery(this.imagePointer);
        }
        else {
            this.showRepeat = true;
        }
    };
    AngularModalGallery.prototype.closeGallery = function () {
        this.opened = false;
        this.cancelEvent.emit(null);
    };
    AngularModalGallery.prototype.prevImage = function () {
        this.loading = true;
        this.currentImageIndex = this.prevIndex(this.currentImageIndex);
        this.openGallery(this.currentImageIndex);
    };
    AngularModalGallery.prototype.nextImage = function () {
        this.loading = true;
        this.currentImageIndex = this.nextIndex(this.currentImageIndex);
        this.openGallery(this.currentImageIndex);
    };
    AngularModalGallery.prototype.openGallery = function (index) {
        this.currentImageIndex = index;
        this.opened = true;
        this.imgSrc = this.modalImages[this.currentImageIndex].img;
        this.loading = false;
    };
    AngularModalGallery.prototype.nextIndex = function (index) {
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
    };
    AngularModalGallery.prototype.prevIndex = function (index) {
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
    };
    AngularModalGallery.decorators = [
        { type: Component, args: [{
                    selector: 'ImageModal',
                    exportAs: 'ImageModal',
                    styleUrls: ['./main.css', './style.css'],
                    template: "\n   <div class=\"ng-gallery\" *ngIf=\"showRepeat\"> \n     <div *ngFor =\"let i of modalImages; let index = index\">\n       <img src=\"{{ i.thumb }}\" class=\"ng-thumb\" (click)=\"openGallery(index)\" alt=\"Image {{ index + 1 }}\" />\n      </div>\n   </div>\n   <div class=\"ng-overlay\" *ngIf=\"opened\">\n    <div class=\"ng-gallery-content\" >\n    <div class=\"uil-ring-css\" *ngIf=\"loading\"><div></div></div>         \n    <a class=\"close-popup\" (click)=\"closeGallery()\"><i class=\"fa fa-close\"></i></a>\n     <a class=\"nav-left\" *ngIf=\"modalImages.length >1\" (click)=\"prevImage()\"><i class=\"fa fa-angle-left\"></i></a>\n     <img *ngIf=\"!loading\" src=\"{{ imgSrc }}\" (click)=\"nextImage()\" class=\"effect\" />\n     <a class=\"nav-right\" *ngIf=\"modalImages.length >1\" (click)=\"nextImage()\"><i class=\"fa fa-angle-right\"></i></a>\n     <span class=\"info-text\">{{ currentImageIndex + 1 }}/{{ modalImages.length }} - Image {{ currentImageIndex+1 }}</span>\n   </div>\n   </div>\n       "
                },] },
    ];
    /** @nocollapse */
    AngularModalGallery.ctorParameters = function () { return []; };
    AngularModalGallery.propDecorators = {
        'modalImages': [{ type: Input },],
        'imagePointer': [{ type: Input },],
        'cancelEvent': [{ type: Output },],
        'onKeyDown': [{ type: HostListener, args: ['window:keydown', ['$event'],] },],
    };
    return AngularModalGallery;
}());
//# sourceMappingURL=angular-modal-gallery.js.map