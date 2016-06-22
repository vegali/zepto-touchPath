/**
 * Created by lijianyong on 2015/6/24.
 */

(function($){
    $.extend($.fn,{
        touchPath:function(options){
            var touchArea = this;//触摸区域
            var pointArea = {};//坐标点实例容器
            var touchList = [];//记录触摸顺序
            touchArea.bind('touchmove',function(event){event.preventDefault();},false);//移除触摸区域默认动作
            function Point(startX,endX,startY,endY){//坐标点构造
                this.startX = startX;
                this.endX = endX;
                this.startY = startY;
                this.endY = endY;
                this.touchs = false;//记录是否被触摸
            }
            Point.prototype.touched = function(index,eventX,eventY){//扩展原型方法判断是否被触摸
                if(this.touchs == false){
                    if(eventX > this.startX && eventX < this.endX && eventY > this.startY && eventY < this.endY){
                        this.touchs = true;
                        touchList.push(index);
                        touchArea.children().eq(index).addClass('on');
                    }
                }
            };
            touchArea.on('touchstart',function(){//监听触摸开始
                touchArea.children().forEach(function(item,index){
                    pointArea[index] = new Point($(item).offset().left,$(item).offset().left+$(item).offset().width,$(item).offset().top,$(item).offset().top+$(item).offset().height);
                })
            });
            touchArea.on('touchmove',function(event){//监听触摸移动
                for(var key in pointArea){
                    pointArea[key].touched(key,event.changedTouches[0].clientX,event.changedTouches[0].clientY);
                }
            });
            touchArea.on('touchend',function(event){//监听触摸完成
                var validate = false;//记录触摸顺序是否合法
                for(var i = 0; i<touchList.length-1;i++){
                    if(touchList[i]<touchList[i+1] && touchList.length == touchArea.children().length){//合法或者总数正确
                        validate = true;
                    }else{
                        validate = false;
                        break;
                    }
                }
                if(validate){//合法操作
                    touchArea.unbind('touchstart');touchArea.unbind('touchmove');touchArea.unbind('touchend');//移除事件监听
                    touchArea.bind('touchmove',function(event){event.preventDefault();},false);//移除触摸区域默认动作
                    options.successCallBack();
                }else{//非法操作
                    touchArea.children().removeClass('on');//移除样式标记
                    touchList = [];                        //清空触摸顺序
                    for(var key in pointArea){
                        pointArea[key].touchs = false;     //重置被触摸标记
                    }
                }
            });
        }
    })
})(Zepto);