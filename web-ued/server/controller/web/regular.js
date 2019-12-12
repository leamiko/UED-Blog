var mongoose = require('mongoose');
var Regular = require('../../models/regularModel');
var Users = require('../../models/user');

//正则表达式列表
exports.getRegularList = async function (req, res, next) {
    let filters = {}
    if (req.body.filters.regularCategory) {
        filters.regularCategory = req.body.filters.regularCategory
    }
    console.log(filters);
    const count = await Regular.countDocuments(filters)
    Regular.find(
        filters,
        null,
        (err, data) => {
            if (err) {
                res.send({
                    status_code: 201,
                    message: err,
                    data: null
                })
            } else {
                res.json({
                    status_code: 200, //状态码   200是成功   其他的码是错误
                    message: 'success', //返回的信息
                    data: data, ///返回的数据   若没有就是null
                    count: count
                })
            }
        }
    )
}

// 新增正则表达式
exports.AddRegular = async function (req, res, next) {
    try {
        const user = {
            _id: req.body.userId
        }
        console.log(user);
        const foundUser = await Users.findOne(user);
        if (foundUser) {
            let postData = {
                regularName: req.body.regularName,
                regularDescribe: req.body.regularDescribe,
                regular: req.body.regular,
                status: 0,
                regularCategory: 1
            }
            const created = await Regular.create([postData])
            res.json({
                status_code: 200,
                message: 'success'
            })
        } else {
            throw new Error('用户信息错误！')
        }

    } catch (error) {
        next(error);
    }
}