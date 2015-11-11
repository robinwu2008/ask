(function(){
         var app = angular.module('inquiry',[]);
         app.controller('InquiryController',function($scope){
                   $scope.products = gem;
			
          $scope.add=function(){	
			     
				  	
                    var obj={
                };
				
				$scope.products.push(obj);  
				 
			   } 			
				 
			$scope.del=function(idx){	
			   $scope.products.splice(idx,1);  
			   }  
         });
		 
		

         
         var gem =[{
                   pn:'MAX232-1',
                   quantity:100,
                   delivery:'2015-11-15',
                   mark:'非常着急',
                   
         },{
                   pn:'MAX232-1',
                   quantity:100,
                   delivery:'2015-11-15',
                   mark:'非常着急',
         },{
                   pn:'MAX232-1',
                   quantity:100,
                   delivery:'2015-11-15',
                   mark:'非常着急',
         },{
                   pn:'MAX232-1',
                   quantity:100,
                   delivery:'2015-11-15',
                   mark:'非常着急',
         }]
		 
		 

			
			
		 
})();


