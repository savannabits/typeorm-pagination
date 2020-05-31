[![author](https://img.shields.io/badge/savannabits-we%20love%20opensource-%23a52b5e)](https://github.com/savannabits)
[![GitHub license](https://img.shields.io/github/license/savannabits/typeorm-pagination)](https://github.com/savannabits/typeorm-pagination)
[![GitHub stars](https://img.shields.io/github/stars/savannabits/typeorm-pagination)](https://github.com/savannabits/typeorm-pagination/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/savannabits/typeorm-pagination)](https://github.com/savannabits/typeorm-pagination/issues)
[![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsavannabits%2Ftypeorm-pagination)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fsavannabits%2Ftypeorm-pagination)
# typeorm-pagination - The missing pagination extension for typeORM

## TL;DR
TypeORM is one of the most popular ORM frameworks for node.js. This middleware is the missing pagination extension for typeORM specifically tailored for express projects.

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
## Usage
Import the pagination function in your main express entry file (app.js, index.js, index.ts etc)
```js
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
Next, let's go ahead and paginate any typeorm entity using the query builder. For example, if we had the User entity and we wanted to paginate it, here is how:

```js
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
#### NOTES:
- You can also call `paginate(n)` where `n= default no. of records per page`. However, it is important to note that this number `n` will be overwritten by the query parameter `per_page` if it is set on the current request, e.g in the sample request below.

#### Sample Request:
```js
GET http://localhost:3000/api/users?page=1&per_page=15
```
#### Sample Result:
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

## Contributions: 
If you would like to improve the package, you can submit PRs on the github page.
[PULL REQUESTS](https://github.com/savannabits/typeorm-pagination/pulls)
## Issues
In case of any issues, please submit them to the issues page of the repo: 
[ISSUES](https://github.com/savannabits/typeorm-pagination/issues)