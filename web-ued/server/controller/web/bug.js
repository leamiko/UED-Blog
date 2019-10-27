var mongoose = require('mongoose');
var Bug = require('../../models/bugItem');
var Dic = require('../../models/dictionary');
var bugComment = require('../../models/comment-bug.js') //引入comment表
var bugReply = require('../../models/reply-bug.js') //引入comment表
var bugLike = require('../../models/like-bug.js') //引入like表


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
      userId: req.body.userId
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
    const foundDetail = await Bug.findOne({
      _id: bid
    })
    res.json({
      status_code: 200,
      message: 'success',
      data: foundDetail
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
    const reslut = await Bug.find(
      filters,
      null, {
        skip: (req.body.pageIndex - 1) * req.body.pageSize,
        limit: req.body.pageSize,
        sort: {
          createAt: -1
        }
      })
    res.json({
      status_code: 200, //状态码   200是成功   其他的码是错误
      message: 'success', //返回的信息
      data: reslut, ///返回的数据
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
    const whereBlog = {
      _id: req.body.bugId
    }
    let comment = {
      commenterName: req.body.commenterName,
      commenterId: req.body.commenterId,
      bugId: req.body.bugId,
      content: req.body.content
    }
    const comSaved = await bugComment.create([comment])
    if (comSaved) {
      debugger;
      const commentNum = await bugComment.countDocuments();
      let updateBlog = {
        commentNum: commentNum ? commentNum + 1 : 1
      }
      const upBuged = await Bug.updateOne(whereBlog, updateBlog);
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
        }
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
      _id: req.query.commentId
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
//删除回复
exports.deleteReply = async function (req, res, next) {
  try {
    var whereComment = {
      _id: req.query.replyId
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