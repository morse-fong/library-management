// 对所有的api接口进行统一管理
import requests from './request'

// 注册接口
export const register = (readerInfo) => requests({
    url: '/register',
    method: 'post',
    data: readerInfo
})
// 登录接口
export const login = (readerInfo) => requests({
    url: '/login',
    method: 'post',
    data: readerInfo
})
// 书籍接口
export const initBooksList = () => requests({
    url: '/books',
    method: 'post'
})
// 书名查找接口
export const searchBook = (bookNameObj) => requests({
    url: '/searchbook',
    method: 'post',
    data: bookNameObj
})
// 用户查找接口
export const searchPerson = (readerInfo) => requests({
    url: '/searchperson',
    method: 'post',
    data: readerInfo
})
//管理员查找管理员接口
export const searchAdmin = (adminInfo) => requests({
    url: '/searchAdmin',
    method: 'post',
    data: adminInfo
})

// 管理员查询借阅接口
export const initBorrowslist = (info) => requests({
    url: '/borrowslist',
    method: 'post',
    data:info
})
// 管理员删除借阅记录接口
export const deleteBorrow = (borrowObj) => requests({
    url: '/deleteborrow',
    method: 'post',
    data: borrowObj
})
export const changeBorrowInfo = (borrowObj) => requests({
    url: '/changeBorrowInfo',
    method: 'post',
    data: borrowObj
})
// 管理员通过读者ID查找借阅记录接口
export const searchBorrow = (infoObj) => requests({
    url: '/searchborrow',
    method: 'post',
    data: infoObj
})
// 管理员获取读者信息接口
export const initReaderList = () => requests({
    url: '/initreaderlist',
    method: 'post',
})
// 管理员获得管理员信息接口
export const initAdminList = () => requests({
    url: '/initadminlist',
    method: 'post',
})
// 管理员添加书籍接口
export const addBooks = (infoObj) => requests({
    url: '/adminaddbooks',
    method: 'post',
    data: infoObj
})
// 管理员添加用户接口
export const addPerson = (infoObj) => requests({
    url: '/adminaddpersons',
    method: 'post',
    data: infoObj
})
// 管理员添加管理员接口
export const addAdmins = (infoObj) => requests({
    url: '/adminaddadmins',
    method: 'post',
    data: infoObj
})
// 管理员添加管理员接口
export const delAdmin = (infoObj) => requests({
    url: '/deladmin',
    method: 'post',
    data: infoObj
})
export const changeAdminInfo= (infoObj) => requests({
    url: '/changeadmininfo',
    method: 'post',
    data: infoObj
})
// 管理员修改图书信息接口
export const changeBookInfo = (infoObj) => requests({
    url: '/changebookinfo',
    method: 'post',
    data: infoObj
})
// 管理员删除图书信息接口
export const delBook = (infoObj) => requests({
    url: '/delbook',
    method: 'post',
    data: infoObj
})
// 管理员删除人员信息接口
export const delPerson = (infoObj) => requests({
    url: '/delperson',
    method: 'post',
    data: infoObj
})


// 管理员修改人员信息接口
export const changePersonInfo = (infoObj) => requests({ // 修改函数名为 changePersonInfo
    url: '/changepersoninfo',
    method: 'post',
    data: infoObj
})
// 管理员提醒读者还书接口
export const alertPerson = (infoObj) => requests({
    url: '/alertperson',
    method: 'post',
    data: infoObj
})

// 读者请求借阅记录接口
export const initBorrows = (readerId) => requests({
    url: '/borrows',
    method: 'post',
    data: readerId
})
// 借书接口
export const addBorrow = (borrowObj) => requests({
    url: '/addborrow',
    method: 'post',
    data: borrowObj
})
// 续借接口
export const continueBorrow = (infoObj) => requests({
    url: '/continueborrow',
    method: 'post',
    data: infoObj
})
// 还书接口
export const returnBook = (infoObj) => requests({
    url: '/returnbook',
    method: 'post',
    data: infoObj
})
// 重新获取学生信息接口
export const initReader = (readerId) => requests({
    url: '/initreader',
    method: 'post',
    data: readerId
})
