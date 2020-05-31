# About typeorm-pagination
## TL;DR
TypeORM is one of the most popular ORM frameworks for node.js. However, the package does not support pagination by default. The good news is that it is relatively easy to extend its query builder, and that is what we did in this package: We extended typeORM's SelectQueryBuilder to support pagination.

## Installation
### Pre-requisites:
 - express
 - @types/express
 - typeorm

#### NPM:
```
npm install typeorm-pagination
```
##### Yarn
```
yarn add typeorm-pagination
```
### Usage
Import the pagination function in your main express entry file (app.js, index.js, index.ts etc)
```js
import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection, SelectQueryBuilder} from "typeorm";
import {pagination} from 'typeorm-pagination';
// Other imports

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    pagination(SelectQueryBuilder);
    app.use(apiResponseMiddleware)
    // setup express app here
    // ...
    // start express server
    app.listen(process.env.PORT || 3000);
    console.log("Express server has started on port "+process.env.PORT||3000);
}).catch(error => console.log(error));

```
Take note of `pagination(SelectQueryBuilder);`, this is where the module is booted.

Next, let's go ahead and paginate any typeorm entity using the query builder. For example, if we had the User entity and we wanted to paginate it, here is how:

```js
// UserController.ts
import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { getPage, getPerPage } from "typeorm-pagination";
export class UserController {

    private repo = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        let users = await this.repo.createQueryBuilder('user')
        .paginate(getPerPage(request), getPage(request));
        return response.status(200).json(users);
    }
}
```
#### A few notes here:
1. paginate function must be called after a select query. You can add all your other queries before finally calling paginate.
2. paginate() takes two parameters both as numbers: per_page and page. Both can be passed as query parameters in get requests.

Sample Request:
```js
GET http://localhost:3000/api/users?page=1&per_page=10
```
Sample Result:
```json
{
    "from":1,
    "to":2,
    "per_page":15,
    "total":2,
    "current_page":1,
    "prev_page":null,
    "next_page":null,
    "data": [
        {
            "id":"1","active":true,"createdAt":"2020-05-29T13:33:18.798Z","updatedAt":"2020-05-29T13:33:18.798Z","username":"coolsam","email":"smaosa@strathmore.edu","firstName":"Sam","middleName":"Arosi","lastName":"Maosa"
        },
        {
            "id":"2","active":true,"createdAt":"2020-05-29T13:33:54.280Z","updatedAt":"2020-05-29T13:33:54.280Z","username":"savbits","email":"savannabits@gmail.com","firstName":"Savannabits","middleName":null,"lastName":"Inc"
        }
    ]
}
```

__Notice__: There are two more helpers you can import from typeorm-pagination to help you extract the per_page and page query params, which will determine the number of records loaded per page and the current page respectively. You can pass optional defaults to each function. The default perPage when not set is currently 15 and the default page when not set is 1.