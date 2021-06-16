import { SelectQueryBuilder } from 'typeorm';
export const paginate = async function(builder: SelectQueryBuilder<any>, page: number, per_page: number): Promise<PaginationAwareObject> {
    let skip = (page-1)*per_page;
    const total = builder;
    const count = await total.getCount()
    const calcule_last_page = count % per_page;
    const last_page = calcule_last_page === 0 ? count / per_page : Math.trunc(count / per_page) + 1;
    let res = await builder
    .skip(skip)
    .take(per_page)
    .getMany()
    return {
        from:       skip<=count ? skip+1 : null,
        to:         (count > skip+per_page) ? skip+per_page : count,
        per_page:   per_page,
        total:      count,
        current_page: page,
        prev_page:  page > 1? (page-1): null,
        next_page:  count > (skip + per_page) ? page+1 : null,
        last_page:  last_page,
        data:       res || []
    }
}

export interface PaginationAwareObject {
    from: any,
    to: any,
    per_page: any,
    total: number|any,
    current_page: number,
    prev_page?: number|null,
    next_page?: number|null,
    last_page: number|null
    data: Array<object|any>|any
}