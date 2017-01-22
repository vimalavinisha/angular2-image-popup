import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularModalGallery } from './angular-modal-gallery';
export var AngularModalGalleryModule = (function () {
    function AngularModalGalleryModule() {
    }
    AngularModalGalleryModule.forRoot = function () {
        return {
            ngModule: AngularModalGalleryModule,
        };
    };
    AngularModalGalleryModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [AngularModalGallery],
                    exports: [AngularModalGallery]
                },] },
    ];
    /** @nocollapse */
    AngularModalGalleryModule.ctorParameters = function () { return []; };
    return AngularModalGalleryModule;
}());
//# sourceMappingURL=angular-modal-gallery_module.js.map