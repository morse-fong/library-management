const express = require('express')
const app = express();
const conn = require('./js/conn')
const {encrypt, decrypt} = require("./js/encrypt.js");
const {nanoid} = require('nanoid')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
const admin = require('./order/admin.js')
const reader = require('./order/reader.js')
app.use(admin)
app.use(reader)

// 公共接口
// console.log(conn);
// 登录接口
app.post('/login', (req, res) => {
    let data = req.body;
    data = JSON.stringify(data)
    data = JSON.parse(data)
    console.log("登录接收的数据", data);

    // 判断接收数据是否为空
    if (!data) {
        res.json({
            msg: '没有提交数据！',
            status: 0
        })
        return false;
    }
    // 管理员/学生验证
    // 电话号码非空校验
    if (!data.phone) {
        res.json({
            msg: '账号不能为空',
            status: 0
        })
        return false;
    }
    // 密码非空校验
    if (!data.password) {
        res.json({
            msg: '密码不能为空',
            status: 0
        })
        return false;
    }
    // 管理员：
    if (data.isAdmin == 'true') {
        conn.query(`select *
                    from admin
                    where id = '${data.phone}'
                      and password = '${data.password}'`, (err, rs) => {
            if (err) throw err;
            if (rs.length > 0) {
                res.json({
                    msg: '管理员登录成功',
                    status: 200,
                    userName: data.phone,
                    isAdmin: true
                })
            } else {
                res.json({
                    msg: '管理员账号或密码错误！',
                    status: 0
                })
            }
        })
    } else {


        // 电话号码格式验证
        const regexp = /^(\+\d{2,3}-)?\d{11}$/;
        if (!regexp.test(data.phone)) {
            res.json({
                msg: '请输入正确的手机号',
                status: 0
            })
            return false;
        }

        // 加密密码
        let userLoginPwd = encrypt(data.password)
        // 检测是否已有账号以及密码的验证
        conn.query(`select readerId, readerName, phone, borrowTimes, ovdTimes
                    from reader
                    where phone = '${data.phone}'
                      and password = '${userLoginPwd}'`, (err, rs) => {
            if (err) throw err;
            // console.log("学生信息：",rs);
            if (rs.length > 0) {
                res.json({
                    msg: '学生登录成功',
                    status: 200,
                    readerId: rs[0].readerId,
                    readerName: rs[0].readerName,
                    readerPhone: rs[0].phone,
                    borrowTimes: rs[0].borrowTimes,
                    ovdTimes: rs[0].ovdTimes,
                    isAdmin: false
                })
            } else {
                res.json({
                    msg: '账号密码错误或该用户未注册！',
                    status: 0
                })
            }
        })
    }
})
// 图书接口
app.post('/books', (req, res) => {
    conn.query(`select *
                from book
                where status = 1`, (err, rs) => {
        let data = rs || []
        if (data.length > 0) {
            res.json({
                msg: '书籍请求成功',
                status: 200,
                data: rs
            })
        } else {
            res.json({
                msg: '书籍请求数据为空',
                status: 0,
            })
        }

    })
})
// 书籍查询接口
app.post('/searchbook', (req, res) => {
    let data = req.body
    // console.log(data.name)
    conn.query(`select *
                from book
                where (bookName like '%${data.name}%' and status = 1)`, (err, book) => {
        book = book || []
        conn.query(`select *
                    from book
                    where author like '%${data.name}%' `, (err, author) => {
            const data = [...new Set(book.concat(author))]
            if (data.length > 0)
                res.json({
                    msg: '查询成功！',
                    data: data,
                    status: 200
                })
            else
                res.json({
                    msg: '查询结果为空！',
                    status: 0
                })
        })

    })
})

// 人员查询接口
app.post('/searchperson', (req, res) => {
    let data = req.body

    conn.query(`select *
                from reader
                where readerName like '%${data.data}%'`, (err, Name) => {
        Name = Name || []
        conn.query(`select *
                    from reader
                    where phone like '%${data.data}%'`, (err, Phone) => {
            Phone = [...new Set(Name.concat(Phone))]
            conn.query(`select *
                        from reader
                        where email like '%${data.data}%'`, (err, Email) => {
                const data = [...new Set(Phone.concat(Email))]
                if (data.length > 0)
                    res.json({
                        msg: '查询成功！',
                        data: data,
                        status: 200
                    })
                else
                    res.json({
                        msg: '查询结果为空！',
                        status: 0
                    })
            })

        })

    })
})
//管理员搜索接口
app.post('/searchAdmin', (req, res) => {
    let data = req.body
    conn.query(`select *
                from admin
                where id like '%${data.data}%'`, (err, ID) => {
        ID = ID || []
        conn.query(`select *
                    from admin
                    where Password like '%${data.data}%'`, (err, Password) => {
            const data = [...new Set(ID.concat(Password))]
            if (data.length > 0)
                res.json({
                    msg: '查询成功！',
                    data: data,
                    status: 200
                })
            else
                res.json({
                    msg: '查询结果为空！',
                    status: 0
                })
        })

    })
})
// 读者接口
app.post('/readers', (req, res) => {
    conn.query(`select *
                from readers`, (err, rs) => {
        let data = rs || []
        if (data.length > 0) {
            res.json({
                msg: '书籍请求成功',
                status: 200,
                data: rs
            })
        } else {
            res.json({
                msg: '书籍请求数据为空',
                status: 0,
            })
        }

    })
})
// 端口监听
app.listen(8080, (err) => {
    if (!err) console.log('服务器启动成功!');

})

