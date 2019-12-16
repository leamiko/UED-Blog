var mongoose = require('mongoose');
var Bug = require('../../models/bugItem');
var Dic = require('../../models/dictionary');
var bugComment = require('../../models/comment-bug.js') //引入comment表
var bugReply = require('../../models/reply-bug.js') //引入comment表
var bugLike = require('../../models/like-bug.js') //引入buglike表
var bugCmtLike = require('../../models/like-bugCmt') //引入bugCmtlike表
var adoptBugComment = require('../../models/adopt-bugComment')
var Users = require('../../models/user')



const reg = /^[0-9]*[1-9][0-9]*$/;

// 新增bug条目
exports.AddBugItems = async function (req, res, next) {
  try {
    if (!req.body.userId) {
      throw new Error('没有用户权限！')
    } else {
      const user = {
        _id: req.body.userId
      }
      const foundUser = await Users.findOne(user);
      if (foundUser) {
        let postData = {
          title: req.body.title,
          tags: req.body.tags,
          content: req.body.content,
          bugStatus: req.body.bugStatus,
          bugSolution: req.body.bugSolution,
          userId: req.body.userId,
          anonymous: req.body.anonymous
        }
        const foundthis = await Bug.findOne({
          title: postData.title
        })
        if (foundthis) {
          throw new Error('该bug条目已存在！')
        } else {
          const created = await Bug.create([postData])
          res.json({
            status_code: 200,
            message: 'success'
          })
        }
      } else {
        throw new Error('用户信息错误！')
      }
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
    });

    const findOne = await Bug.findOne(whereBug);
    const findAuthor = await Users.findOne({
      _id: findOne.userId
    });
    const finded = findOne.toObject();
    finded.authorInfo = !findOne.anonymous ? {
      nickName: findAuthor.nickName,
      account: findAuthor.account,
      avatar: findAuthor.avatar,
    } : null
    res.json({
      status_code: 200,
      message: 'success',
      data: finded
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
        {
          $project: {
            title: 1,
            tags: 1,
            content: 1,
            bugStatus: 1,
            bugSolution: 1,
            userId: {
              $cond: [{
                $eq: ["$anonymous", true]
              }, '', "$userId"]
            },
            likeNum: 1,
            viewNum: 1,
            commentNum: 1,
            comtTallestLikeNum: 1,
            anonymous: 1,
            adopt: 1,
            rank: 1,
            deleted: 1,
            createAt: 1,
            authorInfo: {
              nickName: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.nickName"]
              },
              account: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.account"]
              },
              avatar: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.avatar"]
              },
            }
          }
        },
        {
          $sort: {
            rank: -1
          }
        },
        {
          $skip: ((req.body.pageIndex ? req.body.pageIndex : 1) * 1 - 1) * (req.body.pageSize ? req.body.pageSize : count),
        },
        {
          $limit: (req.body.pageSize ? req.body.pageSize : 10)
        }
      ])
    const [...copyresult] = result
    copyresult.forEach(el => {
      el.authorInfo = {
        nickName: el.authorInfo[0].nickName[0],
        account: el.authorInfo[0].account[0],
        avatar: el.authorInfo[0].avatar[0]
      }
    })
    res.json({
      status_code: 200, //状态码   200是成功   其他的码是错误
      message: 'success', //返回的信息
      data: copyresult, ///返回的数据
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
// 判断是否存在某个标签
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
    const foundUser = await Users.findOne({
      _id: req.body.commenterId
    })
    if (!foundUser) {
      throw new Error('没有当前用户信息');
    }

    let comment = {
      commenterName: foundUser.nickName,
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
//获取评论
exports.getBugComment = async function (req, res, next) {
  try {
    var replys = await bugReply.aggregate(
      [{
          $match: {
            bugId: mongoose.Types.ObjectId(req.query.bugId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'replyerId',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        {
          $lookup: {
            from: 'bugcmtlike',
            localField: '_id',
            foreignField: 'replyId',
            as: 'likerList'
          }
        },
        {
          $project: {
            replyerName: {
              $cond: [{
                $eq: ["$anonymous", true]
              }, '', "$replyerName"]
            },
            replyerId: 1,
            replyTargetName: 1,
            replyTargetId: 1,
            bugId: 1,
            commentId: 1,
            likeNum: 1,
            content: 1,
            anonymous: 1,
            createAt: 1,
            authorInfo: {
              avatar: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.avatar"]
              },
              account: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.account"]
              },
              nickName: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.nickName"]
              }
            },
            likerList: 1,
          }
        },
        {
          $sort: {
            createAt: -1
          }
        }
      ])
    // console.log(replys);
    let comments = await bugComment.aggregate(
      [{
          $match: {
            bugId: mongoose.Types.ObjectId(req.query.bugId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'commenterId',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        {
          $lookup: {
            from: 'bugcmtlike',
            localField: '_id',
            foreignField: 'commentId',
            as: 'likerList'
          }
        },
        {
          $project: {
            commenterName: {
              $cond: [{
                $eq: ["$anonymous", true]
              }, '', "$commenterName"]
            },
            commenterId: 1,
            bugId: 1,
            likeNum: 1,
            content: 1,
            adopt: 1,
            anonymous: 1,
            createAt: 1,
            authorInfo: {
              avatar: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.avatar"]
              },
              account: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.account"]
              },
              nickName: {
                $cond: [{
                  $eq: ["$anonymous", true]
                }, '', "$authorInfo.nickName"]
              }
            },
            likerList: 1
          }
        },
        {
          $sort: {
            createAt: -1
          }
        }
      ])
    const [...copyComments] = comments
    const [...copyReplys] = replys
    copyComments.forEach(mel => {
      if (mel.anonymous) {
        mel.authorInfo = {}
      } else {
        mel.authorInfo = {
          nickName: mel.authorInfo[0].nickName[0],
          account: mel.authorInfo[0].account[0],
          avatar: mel.authorInfo[0].avatar[0]
        }
      }
      mel.replies = copyReplys.map(fel => {
        const {
          ...copyfel
        } = fel;
        if (copyfel.anonymous) {
          copyfel.authorInfo = {}
        } else {
          copyfel.authorInfo = {
            nickName: copyfel.authorInfo[0].nickName[0],
            account: copyfel.authorInfo[0].account[0],
            avatar: copyfel.authorInfo[0].avatar[0]
          }
        }
        return fel.commentId.toString() == mel._id.toString() ? copyfel : undefined
      }).filter(v => v)
    })
    return res.json({
      status_code: 200,
      message: '评论获取成功！',
      data: copyComments
    })
  } catch (error) {
    next(error)
  }
}
//评论点赞
exports.bugCommentLike = async function (req, res, next) {
  try {
    const whereLike = {
      userId: mongoose.Types.ObjectId(req.query.userId),
      bugId: mongoose.Types.ObjectId(req.query.bugId),
      commentId: mongoose.Types.ObjectId(req.query.commentId)
    }
    const likedthisCmt = await bugCmtLike.findOne(whereLike)
    if (likedthisCmt) {
      throw new Error('您已经点过赞了！')
    }
    const whereBug = {
      _id: mongoose.Types.ObjectId(req.query.bugId)
    }
    const whereComment = {
      bugId: mongoose.Types.ObjectId(req.query.bugId)
    }
    const whereUpdateComment = {
      _id: req.query.commentId
    }
    let like = {
      userId: req.query.userId,
      bugId: req.query.bugId,
      commentId: req.query.commentId
    }
    const liked = await bugCmtLike.create([like]);
    const likeNum = await bugCmtLike.countDocuments({
      commentId: req.query.commentId
    })
    let updateComment = {
      likeNum: likeNum
    }
    await bugComment.updateOne(whereUpdateComment, updateComment)
    const comments = await bugComment.find(whereComment).sort({
      likeNum: -1
    })
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
//取消评论点赞
exports.cancelBugCommentLike = async function (req, res, next) {
  try {
    const whereLike = {
      userId: mongoose.Types.ObjectId(req.query.userId),
      bugId: mongoose.Types.ObjectId(req.query.bugId),
      commentId: mongoose.Types.ObjectId(req.query.commentId)
    }
    const foundthisCmt = await bugCmtLike.findOne(whereLike)
    if (!foundthisCmt) {
      throw new Error('取消点赞用户信息匹配错误！')
    }
    const whereBug = {
      _id: mongoose.Types.ObjectId(req.query.bugId)
    }
    const whereComment = {
      bugId: mongoose.Types.ObjectId(req.query.bugId)
    }
    const whereUpdateComment = {
      _id: req.query.commentId
    }
    let like = {
      userId: req.query.userId,
      bugId: req.query.bugId,
      commentId: req.query.commentId
    }
    const liked = await bugCmtLike.deleteOne(like);
    const likeNum = await bugCmtLike.countDocuments({
      commentId: req.query.commentId
    })
    let updateComment = {
      likeNum: likeNum
    }
    await bugComment.updateOne(whereUpdateComment, updateComment)
    const comments = await bugComment.find(whereComment).sort({
      likeNum: -1
    })
    const updateBug = {
      comtTallestLikeNum: comments[0].likeNum
    }
    await Bug.updateOne(whereBug, updateBug)
    return res.json({
      status_code: 200,
      message: '取消评论点赞成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
//回复点赞
exports.bugReplyLike = async function (req, res, next) {
  try {
    const whereLike = {
      userId: mongoose.Types.ObjectId(req.query.userId),
      bugId: mongoose.Types.ObjectId(req.query.bugId),
      replyId: mongoose.Types.ObjectId(req.query.replyId)
    }
    const likedthisRpl = await bugCmtLike.findOne(whereLike)
    if (likedthisRpl) {
      throw new Error('您已经点过赞了！')
    }
    const whereReply = {
      bugId: mongoose.Types.ObjectId(req.query.bugId)
    }
    const whereUpdateReply = {
      _id: req.query.replyId
    }
    let like = {
      userId: req.query.userId,
      bugId: req.query.bugId,
      replyId: req.query.replyId
    }
    const liked = await bugCmtLike.create([like]);
    const likeNum = await bugCmtLike.countDocuments({
      replyId: mongoose.Types.ObjectId(req.query.replyId)
    })
    let updateReply = {
      likeNum: likeNum
    }
    await bugReply.updateOne(whereUpdateReply, updateReply)
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  } catch (error) {
    next(error)
  }
}
// 取消回复点赞
exports.cancelBugReplyLike = async function (req, res, next) {
  try {
    const whereLike = {
      userId: mongoose.Types.ObjectId(req.query.userId),
      bugId: mongoose.Types.ObjectId(req.query.bugId),
      replyId: mongoose.Types.ObjectId(req.query.replyId)
    }
    const foundthisRpl = await bugCmtLike.findOne(whereLike)
    if (!foundthisRpl) {
      throw new Error('取消点赞用户信息匹配错误！')
    } else {
      await bugCmtLike.deleteOne(whereLike);
      return res.json({
        status_code: 200,
        message: '取消回复点赞成功！',
        data: null
      })
    }
  } catch (error) {
    next(error)
  }
}
//删除评论
exports.deleteBugComment = async function (req, res, next) {
  try {
    var whereComment = {
      _id: req.body.commentId,
      bugId: req.body.bugId
    }
    const foundThis = await bugComment.findOne(whereComment);
    if (foundThis) {
      if (foundThis.commenterId == req.body.userId) {
        const delComed = await bugComment.deleteOne(whereComment)
        res.json({
          status_code: 200,
          message: '删除成功！',
          data: null
        })
      } else {
        throw new Error('您不是该评论作者，没有删除权限');
      }
    } else {
      throw new Error('参数错误');
    }
  } catch (error) {
    next(error)
  }
}
//回复
exports.replyBug = async function (req, res, next) {
  try {
    const existCmt = await bugComment.findOne({
      bugId: req.body.bugId,
      _id: req.body.commentId
    })
    if (existCmt) {
      const replyer = await Users.findOne({
        _id: req.body.replyerId
      })
      const targeter = await Users.findOne({
        _id: req.body.replyTargetId
      })
      if (replyer && targeter) {
        let reply = {
          commentId: req.body.commentId,
          replyerName: replyer.nickName,
          replyerId: req.body.replyerId,
          replyTargetName: targeter.nickName,
          replyTargetId: req.body.replyTargetId,
          bugId: req.body.bugId,
          content: req.body.content,
          anonymous: req.body.anonymous
        }
        const addReplyed = await bugReply.create([reply]);
        res.json({
          status_code: 200,
          message: '回复成功！',
          data: null
        })
      } else {
        throw new Error('用户信息错误')
      }
    } else {
      throw new Error('当前目标不存在')
    }
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
        const doneAdopted = await adoptBugComment.findOne({
          userId: req.body.userId,
          bugId: req.body.bugId
        })
        await bugComment.where(whereCmt).updateOne({
          adopt: !!doneAdopted
        });
        await Bug.where(whereBug).updateOne({
          adopt: !!doneAdopted
        });
        return res.json({
          status_code: 200,
          message: doneAdopted ? '采纳成功' : '取消采纳成功',
          data: !!doneAdopted
        })
      } else {
        throw new Error('没有采纳权限');
      }
    } else {
      throw new Error('参数错误');
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