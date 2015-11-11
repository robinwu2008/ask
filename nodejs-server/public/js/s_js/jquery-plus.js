	
      var result = $("#result").val();
	  var maxnum = parseInt($("#result").attr("max"));
	  if(maxnum==null){
		  maxnum = 1;
	  }
	  var minnum = parseInt($("#result").attr("min"));
	  if(minnum==null){
		  minnum = 1;
	  }

	  if($("#result").val() == null || $("#result").val() == "") {		  
		  result = 0;
	  }else {
		  result = parseInt($("#result").val());
		  
	  }

function jian(chengshu){
	  if(result <= minnum) {
		  result = minnum;
	  }else{
		  result = result - minnum;
	  }
	  $("#result").val(result);
	  $("#result2").html("￥"+result*chengshu);
}
function jia(chengshu){
	  if(result < maxnum) {
		  result = result + minnum;
	  }else{
		  result = maxnum;
	  }
	  
	  $("#result").val(result);
	  $("#result2").html("￥"+result*chengshu);
}
