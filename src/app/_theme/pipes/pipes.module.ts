import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterBrandsPipe } from './filter-brands.pipe';
import { BrandSearchPipe } from './brand-search.pipe';
import { ProfilePicturePipe } from './profilePicture.pipe';
import { UserSearchPipe } from './user-search.pipe';
import { FilterByIdOfficePipe } from './filter-by-id-office.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        FilterByIdPipe,
        FilterByIdOfficePipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe
    ],
    exports: [
        FilterByIdPipe,
        FilterByIdOfficePipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe
    ]
})
export class PipesModule { }
