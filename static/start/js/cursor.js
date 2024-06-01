$(function(){
  
    //カーソル要素の指定
    var cursor=$("#cursor");
    //ちょっと遅れてついてくるストーカー要素の指定  
    var stalker=$("#stalker");
    
    //mousemoveイベントでカーソル要素を移動させる
    $(document).on("mousemove",function(e){
      //カーソルの座標位置を取得
      var x=e.clientX;
      var y=e.clientY;
      //カーソル要素のcssを書き換える用
      cursor.css({
        "opacity":"1",
        "top":y+"px",
        "left":x+"px"
      });
      //ストーカー要素のcssを書き換える用    
      setTimeout(function(){
        stalker.css({
          "opacity":"1",
          "top":y+"px",
          "left":x+"px"
        });
      },140);//カーソルより遅れる時間を指定
      
    });
  });