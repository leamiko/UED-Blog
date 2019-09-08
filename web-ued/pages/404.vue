<template>
  <div class="container_404 cus-relative">
		<div class="content_404 cus-absolute cus-fix-center">
      <img src="@/assets/img/404.gif">
      <h2>抱歉，您访问的页面出错了</h2>
      <p>您可能输错了网址，或该网页已删除或不存在</p>
      <el-button type="primary" @click="$router.push('/')" class="cus-box-center">返回主页</el-button>
    </div>
	</div>
</template>

<style lang='scss' scoped>
.container_404 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafa;
}

.content_404 {
  top: calc(50% - 223px);
}

.content_404 {
  max-width: 588px;
  min-width: 300px;
  width: 88%;
}

.content_404 img {
  display: block;
  margin: auto;
  width: 100%;
}

.content_404 h2 {
  font-size: 32px;
  color: #333333;
  text-align: center;
  letter-spacing: 5px;
  padding-top: 33px;
  padding-bottom: 25px
}

.content_404 p {
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
  text-align: center;
  padding-bottom: 35px
}

.content_404 button {
  display: block;
  width: 220px;
}

</style>
