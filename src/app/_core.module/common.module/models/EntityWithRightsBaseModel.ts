import { BaseModel } from './BaseModel';

export abstract class EntityWithRightsBaseModel extends BaseModel {
    public canView: boolean = true;
    public canEdit: boolean = true;
    public canClone: boolean = true;
    public canCancel: boolean = true;
    public canDelete: boolean = true;
    public canApprove: number;
    public canPDV: number;
}
