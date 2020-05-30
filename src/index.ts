import { PaginationAwareObject, paginate } from "./helpers/pagination";
declare module "typeorm" {
    export interface SelectQueryBuilder<Entity> {
        paginate(per_page: number, current_page?: number|null): Promise<PaginationAwareObject>;
    }
}

export function pagination(SelectQueryBuilder: any):void {
    SelectQueryBuilder.prototype.paginate = function(per_page: number,current_page?: number|null): Promise<PaginationAwareObject> {
        if (!current_page) current_page = 1;
        return paginate(this,current_page,per_page);
    }
    console.log("pagination registered");
}