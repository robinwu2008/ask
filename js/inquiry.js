(function(){
         var app = angular.module('inquiry',[]);
         app.controller('InquiryController',function($scope){
                   $scope.products = gem;
				   
				   $scope.data = {
    availableOptions: [
      {id: '1', name: 'MAX'},
      {id: '2', name: 'Intel'},
      {id: '3', name: 'Micro'}
    ],
    selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
    };
			
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


