import { PaginationAwareObject, paginate } from "./helpers/pagination";
import {SelectQueryBuilder} from 'typeorm'
declare module "typeorm" {
    interface SelectQueryBuilder<Entity> {
        paginate(per_page: number, current_page?: number|null): Promise<PaginationAwareObject>;
    }
}

const registerPagination = function():void {
    SelectQueryBuilder.prototype.paginate = async function(per_page: number,current_page?: number|null): Promise<PaginationAwareObject> {
        if (!current_page) current_page = 1;
        return await paginate(this,current_page,per_page);
    }
}
export default {
    registerPagination
};