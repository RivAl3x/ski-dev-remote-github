import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { ISpaceAvailableModel } from '../../_models/space-available.model';
import { $animations } from 'src/app/_theme/utils/app-animations';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  animations: $animations
})
export class DescriptionComponent implements OnInit {

  constructor(
    public localDBService: LocalDBService
  ) { }

  @Input() listingForm: FormGroup;

  @Input() officeTypes: ListOption[] = [];
  //28.12.2021
  @Input() lessonTypes: ListOption[] = [];
  @Input() skiAmenities:  ListOption[] = [];


  @Input() selectedOfficeTypes: Array<any>;

  @Input() amenities: ListOption[] = [];
  @Input() selectedAmenities: Array<any>;

  availableSpaces: ISpaceAvailableModel[] = [];
  @Input() savedAvailableSpaces: Array<ISpaceAvailableModel>;

  @Input() savedImages: Array<any> = [];

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
  images: GALLERY_IMAGE[] = [];

  imageError: string;
  errorMessage: string;

  ngOnInit() {
    this.mapSelectedOfficeTypes();
    this.mapSelectedAmenities();
    this.mapSavedAvailableSpace();
    this.mapSavedImages();

  }
  // forceAddLessonTypes(){
  //   this.localDBService.forceAddLessonTypes()
  // }

  mapSelectedOfficeTypes() {
    const selectedOfficeTypes: FormArray = this.listingForm.get('description').get('officeTypes') as FormArray;

    this.officeTypes.map((officeType) => {
      if (this.selectedOfficeTypes.includes(officeType.id)) {
        selectedOfficeTypes.push(new FormControl(officeType.id));
      }
    });

  }

  onOfficeTypeChange(e) {
    console.info('e.source.value -- ', e.source.value);

    const selectedOfficeTypes: FormArray = this.listingForm.get('description').get('officeTypes') as FormArray;

    if (e.checked) {
      console.info('e.checked -- ', e.checked);
      selectedOfficeTypes.push(new FormControl(e.source.value));

      this.onAddAvailableSpace(e.source.value);
    } else {
      let i: number = 0;
      selectedOfficeTypes.controls.forEach((item: FormControl) => {
        if (item.value == e.source.value) {
          selectedOfficeTypes.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  get availableSpacesControls() {
    return (this.listingForm.get('description').get('availableSpaces') as FormArray).controls;
  }

  mapSavedAvailableSpace() {
    this.savedAvailableSpaces.map((availableSpace) => {
      (<FormArray>this.listingForm.get('description').get('availableSpaces')).push(
        new FormGroup({
          id: new FormControl(availableSpace.id),
          guid: new FormControl(availableSpace.guid),
          idOfficeType: new FormControl(availableSpace.idOfficeType),
          name: new FormControl(availableSpace.name),
          description: new FormControl(availableSpace.description),
          seatsNo: new FormControl(availableSpace.seatsNo),
          unitsNo: new FormControl(availableSpace.unitsNo)
        })
      );
    });
  }

  onAddAvailableSpace(idOfficeType = null) {
    console.info('onAddAvailableSpace clicked! -- idOfficeType:', idOfficeType);
    console.info('availableSpacesControls -- ', this.availableSpacesControls);

    let newId = this.availableSpacesControls.length + 1;

    (<FormArray>this.listingForm.get('description').get('availableSpaces')).push(
      new FormGroup({
        id: new FormControl(null),
        guid: new FormControl(Guid.raw()),
        idOfficeType: new FormControl(idOfficeType),
        name: new FormControl(null),
        description: new FormControl(null),
        seatsNo: new FormControl(null),
        unitsNo: new FormControl(null)
      })
    );
  }

  onDuplicateAvailableSpace(duplicatedSpace: ISpaceAvailableModel) {
    console.info('onDuplicateAvailableSpace clicked!');
    console.info('duplicatedSpace -- ', duplicatedSpace);

    let newId = this.availableSpacesControls.length + 1;

    (<FormArray>this.listingForm.get('description').get('availableSpaces')).push(
      new FormGroup({
        id: new FormControl(null),
        guid: new FormControl(Guid.raw()),
        idOfficeType: new FormControl(duplicatedSpace.idOfficeType.value),
        name: new FormControl(duplicatedSpace.name.value),
        description: new FormControl(duplicatedSpace.description.value),
        seatsNo: new FormControl(duplicatedSpace.seatsNo.value),
        unitsNo: new FormControl(duplicatedSpace.unitsNo.value)
      })
    );
  }

  onDeleteAvailableSpace(index: number) {
    (<FormArray>this.listingForm.get('description').get('availableSpaces')).removeAt(index);
  }

  onAmenitiesChange(e) {
    console.info('e.source.value -- ', e.source.value);

    const selectedAmenities: FormArray = this.listingForm.get('description').get('amenities') as FormArray;

    if (e.checked) {
      console.info('e.checked -- ', e.checked);
      selectedAmenities.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      selectedAmenities.controls.forEach((item: FormControl) => {
        if (item.value == e.source.value) {
          selectedAmenities.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  mapSelectedAmenities() {
    const selectedAmenities: FormArray = this.listingForm.get('description').get('amenities') as FormArray;

    this.amenities.map((amenity) => {
      if (this.selectedAmenities.includes(amenity.id)) {
        selectedAmenities.push(new FormControl(amenity.id));
      }
    });

  }

  mapSavedImages() {
    this.savedImages.map((image) => {
      this.images.push(image);

      this.listingForm.get('description').patchValue({
        images: this.images
      });
    })
  }

  imagesChangeEvent(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event:any) => {
          const imgBase64Path = event.target.result;

          let image = {
            url: imgBase64Path
          }

          this.images.push(image);

          this.listingForm.get('description').patchValue({
            images: this.images
          });
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // open gallery
  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
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
