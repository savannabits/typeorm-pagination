![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/savannabits/typeorm-pagination/npm-publish/master?label=npm-publish&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/savannabits/typeorm-pagination/TypeORM%20Pagination%20CI?label=CI&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/savannabits/typeorm-pagination?style=flat-square)
![npm](https://img.shields.io/npm/dw/typeorm-pagination?style=flat-square)
![npm](https://img.shields.io/npm/dm/typeorm-pagination?style=flat-square)
![npm](https://img.shields.io/npm/dy/typeorm-pagination?style=flat-square)

# typeorm-pagination - The missing pagination extension for typeORM

TypeORM is one of the most popular ORM frameworks for node.js. This middleware is the missing pagination extension for typeORM specifically tailored apps running on the for expressjs or koajs frameworks.

## Installation
### Pre-requisites:
 - [express](https://www.npmjs.com/package/express) or [koa](https://www.npmjs.com/package/koa)
 - [@types/express](https://www.npmjs.com/package/@types/express) or [@types/koa](https://www.npmjs.com/package/@types/koa)
 - [typeorm](https://www.npmjs.com/package/typeorm)

#### NPM:
```
npm install typeorm-pagination
```
##### Yarn
```
yarn add typeorm-pagination
```
## Usage

### Register the Middleware

Import the pagination function in your main express entry file (app.js, index.js, index.ts etc)
```ts
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {pagination} from 'typeorm-pagination'
// Other imports

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(pagination); // Register the pagination middleware
    // setup express app here
    // ...
    // start express server
    app.listen(process.env.PORT || 3000);
    console.log("Express server has started on port "+process.env.PORT||3000);
}).catch(error => console.log(error));

```
### Using the middleware to paginate

Next, let's go ahead and paginate any typeorm entity using the query builder. For example, if we had the User entity and we wanted to paginate it, here is how:

### If you are using the [Data Mapper](https://typeorm.io/#/active-record-data-mapper/what-is-the-data-mapper-pattern) pattern (Repositories)
```ts
// UserController.ts
import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
export class UserController {

    private repo = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        let users = await this.repo.createQueryBuilder('user')
        //...Enter more of your queries here... add relationships etc. THEN:
        .paginate();
        return response.status(200).json(users);
    }
}
```

### Using the [Active Record pattern](https://typeorm.io/#/active-record-data-mapper/what-is-the-active-record-pattern)
If your Entity extends BaseEntity, then you can query using the AR pattern as follows:

```ts
// UserController.ts
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
export class UserController {
    async all(request: Request, response: Response, next: NextFunction) {
        let users = await User.createQueryBuilder('user')
        //...Enter more of your queries here... add relationships etc. THEN:
        .paginate();
        return response.status(200).json(users);
    }
}
```
**Read more on the two Patterns [HERE](https://typeorm.io/#/active-record-data-mapper)**

### How to use with [Routing Controllers](https://github.com/typestack/routing-controllers)
If you are using Routing Controllers to specify your routes as decorations, here is how you can set up and use typeorm-pagination:
#### Register the middleware

You can use the createExpressServer function provided by `routing-controllers` and register the pagination middleware by specifying it under the `middlewares` option.
```ts
// app.ts
import "reflect-metadata";
import {createConnection} from "typeorm";
import { pagination } from "typeorm-pagination";
import { createExpressServer } from "routing-controllers";
createConnection().then(async connection => {
    const port = process.env.PORT || 3000;
    createExpressServer({
        controllers: [
            __dirname +"/controller/**/*"
        ],
        middlewares: [
            //Other middleware
            pagination,
        ]
    }).listen(port);
    console.log("Express server has started on port "+port);
}).catch(error => console.log(error));
```
#### Your controller

In the controller, wherever you have a function that you need to paginate, you MUST specify the pagination middleware using the `@UseBefore` decorator:

```ts
// UserTypeController.ts
import { Request} from "express";
import { BodyParam, Get, JsonController, Post, Req, UseBefore } from "routing-controllers";
import { getRepository, Repository } from "typeorm";
import { pagination } from "typeorm-pagination";
import { UserType } from "../entity/UserType";

@JsonController()
export class UserTypeController {
    private repo: Repository<UserType>
    constructor() {
        this.repo = getRepository(UserType);
    }
    @Post("/user-types")
    async store(@Req() request, @BodyParam('slug') slug: string, @BodyParam("name") name: string) {
        const data = request.body;
        let type = new UserType();
        type.slug = slug;
        type.name = name;
        const res = await this.repo.insert(type);
        return {
            success: true,
            payload: res,
        }
    }
    @Get('/user-types')
    @UseBefore(pagination) // <---- MUST specify the pagination middleware here for it to work.
    async index(@Req() req: Request) {
        return await UserType.createQueryBuilder().paginate(); // If you are using the Active Record Pattern
    }
}
```

### Using [Koa.js](https://koajs.com/)
Since Koa.js is similar to express, the package should work flawlessly with Koa.js, but this is yet to be tested.

Documentation on how to use with the Koa.js framework is coming soon.

### NOTES:
- You can also call `paginate(n)` where `n= default no. of records per page`. However, it is important to note that this number `n` will be overwritten by the query parameter `per_page` if it is set on the current request, e.g in the sample request below.

### Sample Request:
```http
GET http://localhost:3000/user-types?page=1&per_page=15
```
### Sample Response:
```json
{
"from":1,
"to":2,
"per_page":15,
"total":2,
"current_page":1,
"prev_page":null,
"next_page":null,
"last_page":1,
"data":[
     {"id":1,"slug":"staff","name":"Staff"},
     {"id":4,"slug":"student","name":"Student"}
]}
```

__Notice__: There are two more helpers you can import from typeorm-pagination to help you extract the per_page and page query params, which will determine the number of records loaded per page and the current page respectively. You can pass optional defaults to each function. The default perPage when not set is currently 15 and the default page when not set is 1.

## Contributions: 
If you would like to improve the package, you can submit PRs on the github page.
[PULL REQUESTS](https://github.com/savannabits/typeorm-pagination/pulls)
## Issues
In case of any issues, please submit them to the issues page of the repo: 
[ISSUES](https://github.com/savannabits/typeorm-pagination/issues)
