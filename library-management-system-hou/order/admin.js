const express = require('express')
const router = express.Router()
const conn = require('../js/conn')
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: false}))
const nodemailer = require("nodemailer");
const {nanoid} = require('nanoid')
const {encrypt} = require("../js/encrypt");

// 管理员获取借阅记录接口
router.post('/borrowslist', (req, res) => {
    conn.query(`select *
                from (borrow left join reader on borrow.readerId = reader.readerId left join book on borrow.bookId = book.bookId)`, (err, rs) => {
        let data = rs || []
        if (data.length == 0)
            res.json({
                msg: '管理员请求借阅记录为空',
                status: 0,
                data: rs
            })
        else
            res.json({
                msg: '管理员请求借阅记录成功',
                status: 200,
                data: data
            })
    })
})

router.post('/changeBorrowInfo', (req, res) => {
    let data = req.body
    conn.query(`update borrow set returnDate='${data.returnDate}'
                where readerId = '${data.readerId}'
                  and bookId = '${data.bookId}'
                  and borrowDate = '${data.borrowDate}'`,
        (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    msg: '修改失败！',
                });
            } else {
                res.send({
                    status: 200,
                    msg: '修改成功！',
                });
            }
        })
})
router.post('/deleteborrow', (req, res) => {
    let data = req.body
    conn.query(`delete from borrow
                where readerId = '${data.readerId}'
                  and bookId = '${data.bookId}'
                  and borrowDate = '${data.borrowDate}'`,
        (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    msg: '删除失败！',
                });
            } else {
                res.send({
                    status: 200,
                    msg: '删除成功！',
                });
            }
        })
})
// 管理员通过名称查询借阅信息
router.post('/searchborrow', (req, res) => {
    let data = req.body;
    conn.query(`select *
                from (borrow left join reader on borrow.readerId = reader.readerId left join book on borrow.bookId = book.bookId) 
                where readerName like '%${data.info}%' `, (err, reader) => {
        reader = reader || []
        conn.query(`select *
                    from (borrow left join reader on borrow.readerId = reader.readerId left join book on borrow.bookId = book.bookId) 
                    where bookName like '%${data.info}%' `, (err, book) => {
            book = book || []
            const data = [...new Set(reader.concat(book))]
            if (data.length > 0) {
                res.json({
                    msg: '查询成功！',
                    status: 200,
                    data: data
                })
            } else {
                res.json({
                    msg: '查询失败！',
                    err:  book  ,
                    status: 0
                })
            }

        })
    })
})
// 人员管理
// 管理员获取人员信息
router.post('/initreaderlist', (req, res) => {
    conn.query(`select *
                from reader`, (err, rs) => {
        let data = rs || []
        if (data.length == 0) {
            res.json({
                msg: '管理员请求人员记录为空',
                status: 0,
            })
        } else {
            res.json({
                msg: '管理员请求人员记录成功',
                status: 200,
                data: data
            })
        }
    })
})
// 管理员删除人员信息
router.post('/delperson', (req, res) => {
    let data = req.body;
    conn.query(`delete
                from borrow
                where borrow.readerId = '${data.readerId}'`);
    conn.query(`delete
                from reader
                where reader.readerId = '${data.readerId}'`, (err, result) => {
        if (err) {
            res.send({
                msg: '删除人员失败！',
                status: 0
            })
        } else {
            res.send({
                msg: '删除人员成功！',
                status: 200
            })
        }
    });
})
// 管理员添加人员信息
router.post('/addperson', (req, res) => {
    let data = req.body;
    conn.query(
        `insert into reader (readerId, readerName, email)
         values ('${nanoid()}', '${data.readerName}', '${data.email}')`,
        (err, result) => {
            if (err) {
                res.send({
                    msg: '添加人员失败！',
                    status: 0
                })
            } else {
                res.send({
                    msg: '添加人员成功！',
                    status: 200
                })
            }
        }
    );
});
// 管理员修改人员信息
router.post('/changepersoninfo', (req, res) => {
    let data = req.body;
    const regexp = /^(\+\d{2,3}-)?\d{11}$/;
    if (!regexp.test(data.phone)) {
        res.json({
            msg: '请输入正确的手机号',
            status: 0
        })
        return false;
    }

    var verify = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!verify.test(data.email)) {
        res.json({
            msg:'邮箱格式错误, 请重新输入',
            status:0
        })
        return false;
    }

    conn.query(`update reader
                set readerName='${data.readerName}',
                    phone='${data.phone}',
                    borrowTimes='${data.borrowTimes}',
                    email='${data.email}',
                    ovdTimes='${data.ovdTimes}'
                where readerId = '${data.readerId}'`,
        (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    msg: '修改失败！',
                });
            } else {
                res.send({
                    status: 200,
                    msg: '修改成功！',
                });
            }
        })
});
//管理员初始化
router.post('/initadminlist', (req, res) => {
    conn.query(`select *
                from admin`, (err, rs) => {
        let data = rs || []
        if (data.length == 0) {
            res.json({
                msg: '管理员请求管理员记录为空',
                status: 0,
            })
        } else {
            res.json({
                msg: '管理员请求管理员记录成功',
                status: 200,
                data: data
            })
        }
    })
})
//管理员删除管理员
router.post('/deladmin', (req, res) => {
    let data = req.body;
    conn.query(`delete
                from admin
                where id = '${data.id}'`, (err, result) => {
        if (err) {
            res.send({
                msg: '删除人员失败！',
                status: 0
            })
        } else {
            res.send({
                msg: '删除人员成功！',
                status: 200
            })
        }
    })
})
//管理员修改管理员信息
router.post('/changeadmininfo', (req, res) => {
    let data = req.body;
    let adminPwd = encrypt(data.password)
    conn.query(`update admin
                set password='${adminPwd}'
                where id = '${data.id}'`,
        (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    msg: err,
                });
            } else {
                res.send({
                    status: 200,
                    msg: '修改成功！',
                });
            }
        }
    );
    //
    // let status = data.status;
    // switch (status) {
    //   case '1': {
    // 	// 修改姓名
    //
    // 	break;
    //   }
    //   case '2': {
    // 	// 修改邮箱
    // 	conn.query(
    // 	  `update reader set email='${data.value}' where readerId='${data.readerId}'`,
    // 	  (err, result) => {
    // 		if (err) {
    // 		  res.send({
    // 			status: 0,
    // 			msg: '修改邮箱失败！',
    // 		  });
    // 		} else {
    // 		  res.send({
    // 			status: 200,
    // 			msg: '修改邮箱成功！',
    // 		  });
    // 		}
    // 	  }
    // 	);
    // 	break;
    //   }
    //   case '3': {
    // 	// 修改电话
    // 	conn.query(
    // 	  `update reader set phone='${data.value}' where readerId='${data.readerId}'`,
    // 	  (err, result) => {
    // 		if (err) {
    // 		  res.send({
    // 			status: 0,
    // 			msg: '修改电话失败！',
    // 		  });
    // 		} else {
    // 		  res.send({
    // 			status: 200,
    // 			msg: '修改电话成功！',
    // 		  });
    // 		}
    // 	  }
    // 	);
    // 	break;
    //   }
    //   default:
    // 	break;
    // }
});
// 编辑人员信息
router.post('/editperson', (req, res) => {
    const {readerId, readerName, email, phone} = req.body;

    conn.query(
        `UPDATE reader
         SET readerName='${readerName}',
             email='${email}',
             phone='${phone}'
         WHERE readerId = '${readerId}'`,
        (err, result) => {
            if (err) {
                res.send({
                    status: 0,
                    msg: '编辑人员信息失败！',
                });
            } else {
                res.send({
                    status: 200,
                    msg: '编辑人员信息成功！',
                });
            }
        }
    );
});


router.post('/adminaddpersons', (req, res) => {
    let data = req.body;
    console.log("接收的数据", data);

    if (!data) {
        res.json({
            msg: '没有提交数据！',
            status: 0
        })
        return false;
    }
    // 用户名非空校验
    if (!data.username) {
        res.json({
            msg: '用户名不能为空',
            status: 0
        })
        return false;
    }
    // 电话号码非空校验
    if (!data.phone) {
        res.json({
            msg: '手机号不能为空',
            status: 0
        })
        return false;
    }
    // 邮箱非空校验
    if (!data.email) {
        res.json({
            msg: '邮箱不能为空',
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
    // 随机用户ID
    let readerId = nanoid();
    // 加密密码
    let userRegisterPwd = encrypt(data.password)
    // 手机号格式验证
    const regexp = /^(\+\d{2,3}-)?\d{11}$/;
    if (!regexp.test(data.phone)) {
        res.json({
            msg: '手机号格式错误',
            status: 0
        })
        return false;
    }
    conn.query(`select *
                from reader
                where phone = '${data.phone}'`, (err, rs) => {
        if (err) throw err;
        // 注册前先校验该用户是否已经注册过
        if (rs.length > 0) {
            res.json({
                msg: '该手机号已经注册过！',
                status: 0
            })
            console.log("注册：", rs)
        } else {
            conn.query(`insert into reader
                        values ('${readerId}', '${data.username}', '${userRegisterPwd}', '${data.phone}', 0, 0,
                                '${data.email}')`, (err, rs) => {
                if (err) throw err;
                res.json({
                    msg: '注册成功',
                    status: 200
                })
            })
        }
    })
})

router.post('/adminaddadmins', (req, res) => {
    let data = req.body
    let adminRegisterPwd = encrypt(data.password)
    conn.query(`select *
                from admin
                where id = '${data.id}'`, (err, rs) => {
        if (rs.length > 0) {
            res.send({
                msg: '该管理员已存在！',
                status: 0
            })
        } else {
            conn.query(`insert into admin
                        values ('${data.id}', '${adminRegisterPwd}')`)
            res.send({
                msg: '添加管理员成功！',
                status: 200
            })
        }
    })
})

// 图书管理
// 管理员添加图书
router.post('/adminaddbooks', (req, res) => {
    let data = req.body
    conn.query(`select *
                from book
                where position = '${data.position}'`, (err, rs) => {
        if (rs.length > 0) {
            res.send({
                msg: '该位置已有书籍存放！',
                status: 0
            })
        } else {
            conn.query(`insert into book
                        values ('${nanoid()}', '${data.bookName}', '${data.author}', '${data.amount}', '${data.position}
                                ', '${data.amount}', 0, 1)`)
            res.send({
                msg: '添加书籍成功！',
                status: 200
            })
        }
    })
})
// 管理员修改图书信息
router.post('/changebookinfo', (req, res) => {
    let data = req.body
    let status = data.status
    switch (status) {
        case '1': {
            // 修改书名
            conn.query(`update book
                        set bookName='${data.value}'
                        where bookId = '${data.bookId}'`)
            res.send({
                status: 200,
                msg: '修改书名成功！'
            })
            break;
        }
        case '2': {
            // 修改作者
            conn.query(`update book
                        set author='${data.value}'
                        where bookId = '${data.bookId}'`)
            res.send({
                status: 200,
                msg: '修改作者成功！'
            })
            break;
        }
        case '3': {
            // 修改位置
            conn.query(`select *
                        from book
                        where position = '${data.value}'`, (err, rs) => {
                if (rs.length > 0) {
                    return res.send({
                        msg: '该位置已有书籍存放！',
                        status: 0
                    })
                } else {
                    conn.query(`update book
                                set position='${data.value}'
                                where bookId = '${data.bookId}'`)
                    res.send({
                        status: 200,
                        msg: '修改位置成功！'
                    })
                }
            })
            break;
        }
        case '4': {
            // 修改当前库存
            conn.query(`update book
                        set amount='${data.value}'
                        where bookId = '${data.bookId}'`)
            // 修改总库存
            conn.query(`update book
                        set totalAmount=totalAmount + '${data.difference}'
                        where bookId = '${data.bookId}'`)
            res.send({
                status: 200,
                msg: '修改当前库存成功！'
            })
            break;
        }
        default:
            break;
    }
})
// 管理删除图书
router.post('/delbook', (req, res) => {
    let data = req.body
    conn.query(`update book
                set status=0
                where bookId = '${data.bookId}'`)
    res.send({
        msg: '删除图书成功',
        status: 200
    })
})
// 管理提醒用户还书
router.post('/alertperson', (req, res) => {
    let data = req.body
    conn.query(`select email
                from reader
                where readerId = '${data.readerId}'`, (err, rs) => {
        console.log('rs:', rs);
        var email = rs[0].email
        let transporter = nodemailer.createTransport({
            port: 465,
            secure: true,
            auth: {
                user: userEmail, // QQ邮箱
                pass: userCode	// 授权码
            },
        });
        let mailobj = {
            from: userEmail, // 发送者QQ邮箱
            to: `${email}`, // 接收者QQ邮箱
            subject: "举报反馈",
            text: `再不还:${data.bookName}，你押金就是我的了！`, // plain text body [与 html 只能有一个]
            //html: "<b>Hello world?</b>" // html body
        }
        transporter.sendMail(mailobj, (err, data) => {
            console.log(data);
        });

        res.send({
            msg: '发送成功！',
            status: 200
        })
    })

})

module.exports = router
