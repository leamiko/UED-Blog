var mongoose = require('mongoose');
var Regular = require('../../models/regularModel');
var Users = require('../../models/user');

//正则表达式列表
exports.getRegularList = async function (req, res, next) {
    let reg = new RegExp(req.body.searchValue, 'i');
    let filters = {
        $or: [{
            regularName: {
                $regex: reg
            },
        }, {
            regularDescribe: {
                $regex: reg
            }
        }],
        regularCategory: 0
    };
    filters.regularCategory = req.body.regularCategory;
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

// 查看正则表达式详情
exports.getRegularDetail = function (req, res, next) {
    let rid = req.query.regularId
    console.log(rid);
    Regular.findOne({
            _id: rid
        },
        (err, data) => {
            if (data) {
                return res.json({
                    status_code: 200,
                    message: 'success',
                    data: data
                })
            }
            if (err) {
                return res.json({
                    status_code: 201,
                    message: err,
                    data: null
                })
            }
        }
    )
}

// 更新正则表达式详情
exports.updateRegularById = function (req, res, next) {
    var id = req.body.regularId
    var update = req.body
    Regular.findByIdAndUpdate(id, update, {
        new: true
    }, function (err, result) {
        if (err) {
            res.send({
                status_code: 201,
                message: err,
                data: null
            })
        } else {
            res.json({
                data: result,
                status_code: 200,
                message: 'success'
            })
        }
    })
}