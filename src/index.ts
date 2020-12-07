import express, {Request, Response, NextFunction, response}  from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import router from './router';

// 问题1: express 库类型定义文件 .d.ts 文件类型描述不准确
// 问题2: 当我们使用中间件当时候，对 req 或者 res 做来修改之后呢，实际上类型并不能改变
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    cookieSession({
        name: 'session',
        keys: [
            'teacher'
        ],
        maxAge: 24 * 60 * 60 * 1000
    })
)
app.use(router);

app.listen(7001, () => {
    console.log('server is running')
});