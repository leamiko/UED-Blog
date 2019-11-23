var mongoose = require('mongoose');
var Bug = require('../../models/bugItem');
var Dic = require('../../models/dictionary');
var bugComment = require('../../models/comment-bug.js') //引入comment表
var bugReply = require('../../models/reply-bug.js') //引入comment表
var bugLike = require('../../models/like-bug.js') //引入like表
var adoptBugComment = require('../../models/adopt-bugComment')


const reg = /^[0-9]*[1-9][0-9]*$/;

// 新增bug条目
exports.AddBugItems = async function (req, res, next) {
  try {
    var postData = {
      title: req.body.title,
      // keyword: req.body.keyword,
      tags: req.body.tags,
      content: req.body.content,
      bugStatus: req.body.bugStatus,
      bugSolution: req.body.bugSolution,
      author: req.body.author,
      userId: req.body.userId,
      anonymous: req.body.anonymous
    }
    const foundthis = await Bug.findOne({
      title: postData.title
    })
    if (foundthis) {
      throw new Error('添加失败，该bug条目已存在！')
    } else {
      const created = await Bug.create([postData])
      res.json({
        status_code: 200,
        message: 'success'
      })
    }
  } catch (error) {
    next(error);
  }
}
// 根据bug条目id查看bug详情
exports.GetBugDetail = async function (req, res, next) {
  try {
    let bid = req.query.bugId;
    const whereBug = {
      _id: bid
    }
    const thisComment = await bugComment.find({
      bugId: req.query.bugId
    });
    const viewed = await Bug.where(whereBug).updateOne({
      $inc: {
        viewNum: 1
      },
      commentNum: thisComment.length
    })

    const findOne = await Bug.findOne(whereBug);
    res.json({
      status_code: 200,
      message: 'success',
      data: findOne
    })
  } catch (error) {
    next(error)
  }
}
// 获取bug列表
exports.GetBugList = async function (req, res, next) {
  var filters = {
    deleted: false
  }
  if (req.body.filters) {
    if (req.body.filters.title) {
      filters.title = new RegExp(req.body.filters.title)
    }
    if (req.body.filters.bugStatus) {
      filters.bugStatus = req.body.filters.bugStatus
    }
    if (req.body.filters.author) {
      filters.author = req.body.filters.author
    }
    if (req.body.filters.tags && req.body.filters.tags.length > 0) {
      filters.tags = {
        $in: req.body.filters.tags
      }
    }
  }
  try {
    const count = await Bug.countDocuments(filters)
    const result = await Bug.aggregate(
      [{
          $match: filters
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        // {
        //   $project: {
        //     // title: 1,
        //     // keyword: 0,
        //     // tags: 1,
        //     // content: 1,
        //     // bugStatus: 1,
        //     // bugSolution: 1,
        //     // author: 1,
        //     // userId: 0,
        //     // likeNum: 1,
        //     // viewNum: 1,
        //     // commentNum: 1,
        //     // comtTallestLikeNum: 1,
        //     // anonymous: 1,
        //     // adopt: 1,
        //     // rank: 1,
        //     // deleted: 1,
        //     // createAt: 1,
        //     // authorInfo: {
        //     //   nickName: 1,
        //     //   account: 1,
        //     //   avatar: 1
        //     // }
        //   }
        // },
        {
          $sort: {
            rank: -1
          }
        },
        {
          $skip: (req.body.pageIndex * 1 - 1) * req.body.pageSize,
        },
        {
          $limit: req.body.pageSize
        }
      ])
    res.json({
      status_code: 200, //状态码   200是成功   其他的码是错误
      message: 'success', //返回的信息
      data: result, ///返回的数据
      count: count
    })
  } catch (error) {
    next(error);
  }
}
// bug条目更新
exports.UpdateBugById = async function (req, res, next) {
  try {
    const result = await Bug.findByIdAndUpdate(
      req.body.id,
      req.body, {
        new: true
      })
    res.json({
      status_code: 200,
      message: 'success',
      data: result
    })
  } catch (error) {
    next(error);
  }
}
// bug条目删除
exports.DeleteBugById = async function (req, res, next) {
  try {
    var id = req.body.id
    const result = await Bug.findByIdAndDelete(id);
    res.json({
      status_code: 200,
      message: 'success'
    })
  } catch (error) {
    next(error);
  }
}
// bug点赞
exports.LikeBugById = async function (req, res, next) {
  try {
    const whereBug = {
      _id: req.body.bugId
    }
    const whereUserBugLike = {
      userId: req.body.userId,
      bugId: req.body.bugId
    }
    const userBugLike = await bugLike.findOne(whereUserBugLike);
    if (userBugLike) {
      let totalN = userBugLike.count + req.body.count;
      if (totalN > 50) {
        await Bug.where(whereBug).updateOne({
          $inc: {
            likeNum: (50 - userBugLike.count)
          }
        })
        await userBugLike.updateOne({
          count: 50
        })
      } else {
        await Bug.where(whereBug).updateOne({
          $inc: {
            likeNum: req.body.count
          }
        })
        await userBugLike.updateOne({
          $inc: {
            count: req.body.count
          }
        })
      }
    } else {
      const upnum = req.body.count > 50 ? 50 : req.body.count;
      let like = new bugLike({
        userId: req.body.userId,
        bugId: req.body.bugId,
        count: upnum
      })
      await like.save();
      await Bug.where(whereBug).updateOne({
        $inc: {
          likeNum: upnum
        }
      })
    }
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  } catch (error) {
    next(error);
  }
}
// 获取该用户对某个条目的点赞数量
exports.getThisBugUserLikeNum = async function (req, res, next) {
  try {
    const whereUserBugLike = {
      userId: req.body.userId,
      bugId: req.body.bugId
    }
    const userBugLike = await bugLike.findOne(whereUserBugLike);
    return res.json({
      status_code: 200,
      message: '请求成功！',
      data: userBugLike
    })
  } catch (error) {
    next(error)
  }
}
// tags
// 获取tags列表
exports.GetBugTags = async function (req, res, next) {
  try {
    const rootTag = await Dic.find({
      name: 'bugTags'
    }).exec();
    const parentTag = await Dic.find({
      parentId: rootTag[0]._id
    }).exec();
    const tores = parentTag.map(el => {
      return {
        _id: el._id,
        name: el.name,
        children: []
      }
    })
    for (ptag of tores) {
      let ctags = await Dic.find({
        parentId: ptag._id
      }).exec();
      ptag.children = ctags.map(ct => {
        return {
          _id: ct._id,
          name: ct.name
        }
      })
    }
    res.json({
      status_code: 200,
      message: 'success',
      data: tores
    })
  } catch (error) {
    next(error);
  }
}
// 添加其他标签
exports.AddTags = async function (req, res, next) {
  try {
    if (!req.body.parentName || !req.body.name)
      throw new Error('参数错误');
    const foundRootTag = await Dic.findOne({
      name: 'bugTags'
    }).exec();
    if (foundRootTag) {
      const foundPtag = await isthereatag(foundRootTag._id, req.body.parentName);
      if (foundPtag) {
        const foundTag = await isthereatag(foundPtag._id, req.body.name);
        if (!!foundTag) {
          throw new Error('该标签已存在！');
        } else {
          const createTag = await Dic.create([{
            name: req.body.name,
            parentId: foundPtag._id,
            parentName: req.body.parentName
          }]);
          res.json({
            status_code: 200,
            message: 'success'
          })
        }
      } else {
        throw new Error('没有找到对应的父级标签！');
      }
    } else {
      throw new Error('没有找到对应的根标签！');
    }
  } catch (error) {
    next(error);
  }
}
// 判断是否存在某个bug
exports.IsThereATag = async function (req, res, next) {
  try {
    if (!req.body.parentName || !req.body.name)
      throw new Error('参数错误');
    const foundRootTag = await Dic.findOne({
      name: 'bugTags'
    }).exec();
    if (foundRootTag) {
      const foundPtag = await isthereatag(foundRootTag._id, req.body.parentName);
      if (foundPtag) {
        const foundTag = await isthereatag(foundPtag._id, req.body.name);
        res.json({
          status_code: 200,
          message: 'success',
          data: !!foundTag
        })
      } else {
        throw new Error('没有找到对应的父级标签！');
      }
    } else {
      throw new Error('没有找到对应的根标签！');
    }
  } catch (error) {
    next(error);
  }
}
async function isthereatag(pid, name) {
  const x = await Dic.findOne({
    $and: [{
        parentId: pid
      },
      {
        name: name
      }
    ]
  }).exec();
  return x;
}

// 检索文章
exports.SearchBug = async function (req, res, next) {
  try {
    let countData;
    let sql;
    let countSize = req.body.pageSize;
    let countIndex = req.body.pageIndex - 1;
    if (req.body.keywords) {
      const keywords = new RegExp(req.body.keywords);
      sql = {
        $or: [{
            title: {
              $regex: keywords
            }
          },
          {
            keywords: {
              $regex: keywords
            }
          },
          {
            content: {
              $regex: keywords
            }
          },
          {
            author: {
              $regex: keywords
            }
          }
        ]
      };
    } else {
      sql = {}
    }
    countData = await Bug.find(sql).skip(countIndex * countSize).limit(countSize);
    res.json({
      status_code: 200, //状态码   200是成功   其他的码是错误
      message: 'success', //返回的信息
      data: countData, ///返回的数据
      count: countData.length
    })
  } catch (error) {
    next(error);
  }
}

// bug评论
//评论
exports.commentBug = async function (req, res, next) {
  try {
    let comment = {
      commenterName: req.body.commenterName,
      commenterId: req.body.commenterId,
      bugId: req.body.bugId,
      content: req.body.content,
      anonymous: req.body.anonymous
    }
    const comSaved = await bugComment.create([comment])
    if (comSaved) {
      const whereBug = {
        _id: req.body.bugId
      }
      await Bug.where(whereBug).updateOne({
        $inc: {
          commentNum: 1
        }
      })
      res.json({
        status_code: 200,
        message: '添加成功！',
        data: null
      })
    }
  } catch (error) {
    next(error)
  }
}
//评论点赞
exports.bugCommentLike = async function (req, res, next) {
  try {
    const whereBug = {
      _id: req.query.bugId
    }
    const whereComment = {
      bugId: req.query.bugId
    }
    const whereUpdateComment = {
      _id: req.query.commentId
    }
    let like = {
      userId: req.query.userId,
      commentId: req.query.commentId
    }
    const liked = await bugLike.create([like]);
    const likeNum = await bugLike.countDocuments({
      commentId: req.query.commentId
    })
    let updateComment = {
      likeNum: likeNum
    }
    await bugComment.updateOne(whereUpdateComment, updateComment)
    const comments = await bugComment.find(whereComment).sort({
      likeNum: -1
    })
    console.log(comments);
    const updateBug = {
      comtTallestLikeNum: comments[0].likeNum
    }
    await Bug.updateOne(whereBug, updateBug)
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
//获取评论
exports.getBugComment = async function (req, res, next) {
  try {
    const whereComment = {
      bugId: req.query.bugId
    }
    const comments = await bugComment.aggregate(
      [{
          $match: {
            bugId: whereComment.bugId
          }
        },
        {
          $lookup: {
            from: 'bugreply',
            localField: '_id',
            foreignField: 'commentId',
            as: 'replies'
          }
        },
        {
          $project: {
            commenterId: {
              $cond: [{
                $eq: ["$anonymous", true]
              }, "", "$commenterId"]
            },
            commenterName: {
              $cond: [{
                $eq: ["$anonymous", true]
              }, "", "$commenterName"]
            },
            bugId: 1,
            likeNum: 1,
            content: 1,
            anonymous: 1,
            adopt: 1,
            createdAt: 1
          }
        },
      ])
    res.json({
      status_code: 200,
      message: '获取评论成功！',
      data: comments
    })
  } catch (error) {
    next(error);
  }
}

//删除评论
exports.deleteBugComment = async function (req, res, next) {
  try {
    var whereComment = {
      _id: req.body.commentId
    }
    const delComed = await bugComment.deleteOne(whereComment)
    res.json({
      status_code: 200,
      message: '删除成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
//回复
exports.replyBug = async function (req, res, next) {
  try {
    console.log(req.body)
    let reply = req.body
    const addReplyed = await bugReply.create([reply]);
    console.log(addReplyed);
    res.json({
      status_code: 200,
      message: '添加成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
// 采纳评论
exports.adoptComment = async function (req, res, next) {
  try {
    const whereCmt = {
      _id: req.body.commentId
    }
    const whereBug = {
      _id: req.body.bugId
    }
    const findthisCmt = await bugComment.findOne(whereCmt);
    const findthisBug = await Bug.findOne(whereBug);

    if (findthisCmt && findthisBug) {
      if (findthisBug.userId == req.body.userId) {
        const isAdopted = await adoptBugComment.findOne({
          userId: req.body.userId,
          bugId: req.body.bugId
        })
        if (isAdopted) {
          await adoptBugComment.deleteOne({
            userId: req.body.userId,
            bugId: req.body.bugId
          })
        } else {
          const adopt = new adoptBugComment({
            userId: req.body.userId,
            bugId: req.body.bugId,
            commentId: req.body.commentId
          })
          await adopt.save();
        }
        await bugComment.where(whereCmt).updateOne({
          adopt: req.body.adopt
        });
        await Bug.where(whereBug).updateOne({
          adopt: req.body.adopt
        });
        return res.json({
          status_code: 200,
          message: req.body.adopt == 'true' ? '采纳成功' : '取消采纳成功',
          data: null
        })
      } else {
        next('采纳失败！');
      }
    } else {
      next('评论失败！');
    }
  } catch (error) {
    next(error)
  }
}
//删除回复
exports.deleteReply = async function (req, res, next) {
  try {
    var whereComment = {
      _id: req.body.replyId
    }
    const delReplyed = await bugReply.deleteOne(whereComment)
    res.json({
      status_code: 200,
      message: '删除成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
// rank定时任务
exports.rankTask = async function (req, res, next) {
  try {
    const bugs = await Blog.find()
    for (let i = 0; i < bugs.length; i++) {
      const rank =
        ((4 * Math.log(bugs[i].viewNum) / Math.LN10 +
          (4 * Math.log(bugs[i].commentNum)) / Math.LN10 +
          (3 * Math.log(bugs[i].commentLikeNum)) / Math.LN10) / count(bugs[i].createAt))
      const whereBug = {
        _id: bugs[i]._id
      }
      const updateBug = {
        rank: rank
      }
      await Bug.updateOne(whereBug, updateBug)
    }
    return res.json({
      status_code: 200,
      message: '更新排序成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}