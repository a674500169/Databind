

var MtoVTool = {
  text:function(node,jModel,strAttr){
    if(strAttr == null){
        return;
    }
    var that = this;

    strAttr.forEach(function(key){
      var copyStr = node.textContent;
      node.textContent = copyStr.replace(key,that.getValueModle(jModel,key));
    })
  },
  input:function(node,val){

  },
  getValueModle:function(jModel,strmodel){
    var reg = /\{\{(.*)\}\}/,
        regArr = /(^\w+)\[(\d)\]/,
        that = this,
        jsonNow = jModel;

    reg.test(strmodel);

    var arrKey = RegExp.$1.split(".");

    arrKey.forEach(function(key){
      //如为数组格式
      if(regArr.test(key)){
        jsonNow = jsonNow[RegExp.$1][RegExp.$2];
        console.log(jsonNow);
      }else{
        jsonNow = jsonNow[key];
      }
      
    })
    return jsonNow;
  }
}

//实现模版编译
function CompileTmp(options){
  this.data = options.data;
  this.node = document.getElementById(options.ele);
  this.run();
}

CompileTmp.prototype = {
  run:function(){
    var flagEle = this.getNodeFragment(this.node);
    this.compileFragment(flagEle,this.data);
    this.node.appendChild(flagEle);
  },

  /* 获得文档片段
   * @arg  docnode 元素节点
   */
  getNodeFragment:function(docnode){
    var flag = document.createDocumentFragment(),
        child;
    while(child = docnode.firstChild){
      flag.appendChild(child);
    }
    return flag;
  },
   /* 获得文档片段
   * @arg  flagnode 片段节点 data 数据
   */
  compileFragment:function(flagnode,data){
    var childNodes = flagnode.childNodes,
        reg = /\{\{(\w+(\[\d\])?\.?){1,}\}\}/g, //匹配所有模版
        that = this;

     childNodes.forEach(function(node){

        //节点类型 1 元素 3 文本
        if(node.nodeType==1){
          //指令块

        }else if(node.nodeType==3){
          //数据插入
          MtoVTool.text(node,data,node.textContent.match(reg));
          
        }

        //如果有子节点 则继续渲染
        if(node.childNodes&&node.childNodes.length){
          that.compileFragment(node,data)
        }
     })
  }
}
var sData = {
      data:{
        text:"哈哈",
        tt:["hello","world"],
        ss:[{yy:"dayday"},"up"]
      }
  }
var app = new CompileTmp({
  ele:"my-app",
  data:sData
});