import fs from "fs";
import path from "path";
import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import Analyzer from "./utils/analyzer";
import { getResponseData } from './utils/utils';



interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checklogin = (req: Request, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : false;
    if(isLogin) {
        next();
    }else {
        // res.send('请先登录')
        res.json(getResponseData(null, '请先登录'));
    }
}

const router = Router();

router.get("/", (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
            <html>
                <body>
                    <div>
                        <a href='/getData'>爬取内容</a>
                    </div>
                    <div>
                        <a href='/showData'>展示内容</a>
                    </div>
                    <a href='/logout'>退出</a>
                </body>
            </html>
            `);
  } else {
    res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password"/>
                        <button>登录</button>
                    </form>
                </body>
            </html>
            `);
  }
});
router.post("/login", (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    // res.send("已经登录过");
    res.json(getResponseData(false,'已经登录过'))
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
    //   res.send("登录成功！");
    res.json(getResponseData(true))
    } else {
    //   res.send(`登录失败`);
    res.json(getResponseData(false,'登录失败'))
    }
  }
});
router.get("/logout", (req: RequestWithBody, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
//   res.redirect("/");
    res.json(getResponseData(true))
});

router.get("/getData",checklogin, (req: RequestWithBody, res: Response) => {
    const secret = "x3b174jsx";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const abalyzer = Analyzer.getInstance();
    new Crowller(url, abalyzer);
    // res.send("get data success");
    res.json(getResponseData(true))
  
});

router.get("/showData", checklogin,(req: RequestWithBody, res: Response) => {
  
    try {
      const position = path.resolve(__dirname, "../data/course.json");
      const result = fs.readFileSync(position, "utf8");
    //   res.json(JSON.parse(result));
      res.json(getResponseData(JSON.parse(result)))
    } catch (e) {
    //   res.send("尚未爬取到内容");
    res.json(getResponseData(false,'数据不存在'))
    }
  
});
export default router;
