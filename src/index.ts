import { Request } from 'express';
import { PaginationAwareObject, paginate } from "./helpers/pagination";
declare module "typeorm" {
    export interface SelectQueryBuilder<Entity> {
        paginate(per_page: number, current_page?: number|null): Promise<PaginationAwareObject>;
    }
}

export function pagination(SelectQueryBuilder: any):void {
    SelectQueryBuilder.prototype.paginate = async function(per_page: number,current_page?: number|null): Promise<PaginationAwareObject> {
        if (!current_page) current_page = 1;
        return await paginate(this,current_page,per_page);
    }
    console.log("pagination registered");
}
export function getPerPage(req: Request, defaultPerPage:number = 15) {
    return parseInt(req.query.per_page as string)|| defaultPerPage
}
export function getPage(req: Request, defaultPage:number=1) {
    return parseInt(req.query.page as string) || defaultPage
}