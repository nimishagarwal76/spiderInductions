$(document).ready(function(){

  var addBtn = document.querySelector('#addBtn');
  var addInput = document.querySelector('#addInput');
  add.addEventListener('click',function(e){
    e.preventDefault();
    console.log(add.value);
  })
  // $('form').on('submit', function(){
  //
  //     var item = $('form input');
  //     var todo = {item: item.val()};
  //
  //     $.ajax({
  //       type: 'POST',
  //       url: '/todo',
  //       data: todo,
  //       success: function(data){
  //         //do something with the data via front-end framework
  //         location.reload();
  //       }
  //     });
  //
  //     return false;
  //
  // });

  // $('li').on('click', function(){
  //     var item = $(this).text().replace(/ /g, "-");
  //     $.ajax({
  //       type: 'DELETE',
  //       url: '/todo/' + item,
  //       success: function(data){
  //         //do something with the data via front-end framework
  //         location.reload();
  //       }
  //     });
  // });

});
