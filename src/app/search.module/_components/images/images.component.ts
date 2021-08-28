import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @Input('images') images: Array<any> = [];

  @ViewChild(NgxImageGalleryComponent) 
  ngxImageGallery: NgxImageGalleryComponent;

  // gallery configuration
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
    inline: false,
    reactToMouseWheel: false,
    showThumbnails: false
  };

  //galler images
  galleryImages: GALLERY_IMAGE[] = [];

  constructor() { }

  ngOnInit() { 
    //console.info('images --- - --- ---', this.images);
  }

  public getBanner(index) {
    return this.images[index];
  }

  public getBgImage(index) {
    let imgUrl = this.images[index].url;

    //console.info(imgUrl);

    let bgImage = {
      'backgroundImage': index <= this.images.length ? 'url('+ imgUrl + ')' : 'url(https://via.placeholder.com/600x400/ff0000/fff/)'
    };
    return bgImage;
  } 

  // open gallery
  openGallery(index: number = 0) {
    if (index <= this.images.length) {
      this.ngxImageGallery.open(index);
    } else {
      this.ngxImageGallery.open(0);
    }
    
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  // callback on gallery opened
  galleryOpened(index) {
    console.info('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    console.info('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.info('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.info('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    this.images.splice(index, 1);

    console.info('Delete image at index ', index);

    /* if (this.images.length > 0) {
        index === 0 ? this.ngxImageGallery.next() : this.ngxImageGallery.prev();
    } else {
        this.closeGallery();
    } */
  }

}
