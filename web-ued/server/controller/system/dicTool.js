// 生成树
exports.generateTree = function(data, id) {
    const arrdata = [];
    console.log(id);
    if (id != undefined) {
      for (let item of data) {
        if (item._id == id) {
          let obj = {
            _id: item._id,
            parentId: item.parentId,
            name: item.name,
            children: []
          };
          // 于每个一级节点进行子节点的获取
          // console.log('parent', obj)
          obj.children = getChildren(data, item);
          arrdata.push(obj);
        }
      }
    } else {
      for (let item of data) {
        if (item.parentId == '') {
          let obj = {
            _id: item._id,
            parentId: item.parentId,
            name: item.name,
            children: []
          };
          // 于每个一级节点进行子节点的获取
          // console.log('parent', obj)
          obj.children = getChildren(data, item);
          arrdata.push(obj);
        }
      }
    }
  
    return arrdata;
  };
  
  // 递归子树
  getChildren = function(arr, node) {
    let children = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parentId == node._id) {
        let obj = {
          _id: arr[i]._id,
          parentId: arr[i].parentId,
          name: arr[i].name,
          children: []
        };
        arr.splice(i, 1);
        i--;
        if (arr.length > 0) {
          // 递归查找子节点
          obj.children = getChildren(arr, obj);
        }
        children.push(obj);
      }
    }
    return children;
  };