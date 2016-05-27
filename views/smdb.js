//Déclaration du module
var smdb = angular.module('smdb', []);

//Déclaration du contrôleur
smdb.controller('main', function($scope) {
	$scope.movies = [
		{id: 1, title: "Godzilla", rating: 7, directors:"Gareth Edwards" , cast:"Aaron Taylor-Johnson,  Elizabeth Olsen,  Bryan Cranston" , year: 2014,thumbnailUrl: "http://vignette1.wikia.nocookie.net/godzilla/images/b/b6/Spanish_Godzilla_2014_Poster.jpg/revision/latest?cb=20140313055712", descriptionText:"a big fat dinosor saves the day"},
		{id: 2, title:"Robocop",  rating: 6, directors:"José Padilha" , cast:"Joel Kinnaman,  Gary Oldman,  Michael Keaton " , year:2015, thumbnailUrl: "http://orig12.deviantart.net/92ae/f/2013/250/2/0/robocop_2014___theatrical_poster__version_1__by_camw1n-d6lcv8i.png", descriptionText:"a cyborg seeks revenge"},
		{id: 3, title:"Captain America: Civil War", rating: 8, directors:" Anthony Russo,  Joe Russo " , cast:"Chris Evans,  Robert Downey Jr.,  Scarlett Johansson " , year: 2016, thumbnailUrl:"http://fr.web.img6.acsta.net/c_215_290/pictures/16/03/11/09/46/182814.jpg", descriptionText:"lots of family fights incoming"}, 
	];
	
	$scope.nbPage = $scope.movies.length;
	$scope.currentPage = 1;
	$scope.$watch('movies',updateNbPage,true);
	
	function updateNbPage(){
		$scope.nbPage = $scope.movies.length;
	};
});

/* Directive de gestion des formulaires */
smdb.directive('forms', function(){
	return{
		restrict: 'E',
		template:
			// !! REMPLACER PAR ng-show="showForm"
			'<div ng-show="true" class="actionForm">'+
				'<form name="form">'+
					 '<fieldset>'+
					 		'<legend>Basic Info</legend>'+
							'<label>Title</label><br><input ng-model="title" type="text" placeholder="..." maxsize="20" name="title" required/><span></span><br>'+
							'<label>Year</label><br><input ng-model="year" type="number" placeholder="..." maxsize="20" name="year"/><span></span><br>'+
							'<label>Directors </label><br><input ng-model="directors" type="text" placeholder="..." maxsize="20" name="directors"/><span></span><br>'+
							'<label>Cast </label><br><input ng-model="cast" type="text" placeholder="..." maxsize="20" name="cast"/><span></span><br><br>'+
					 '</fieldset>'+
					 '<fieldset>'+
					 		'<legend>Title Meta</legend>'+
							'<label>Rating</label><br><input ng-model="rating" type="number" placeholder="/10" maxsize="2" name="rating"/><span></span><br>'+
							'<label>Description</label><br><input ng-model="description" type="text" placeholder="Movie Plot" maxsize="20" name="description"/><span></span><br>'+
							'<label>Url</label><br><input ng-model="url" type="text" placeholder="Poster\'s URL" maxsize="50" name="url"/><span></span><br><br>'+
						 '<input ng-click="submit()" type="submit" value="Submit"/>'+
					 '</fieldset>'+
				 '</form>'+
				'<div>',
		controller: function($scope){
			$scope.showForm = false;
			$scope.submit = "empty";
			
			$scope.$on('EDIT_TITLE', function(e){
				$scope.showForm = true;
				$scope.submit = "edit";
			});
			
			$scope.$on('ADD_TITLE', function(e){
				$scope.showForm = true;
				$scope.submit = "add";
			});
			
			$scope.$on('CANCEL', function(e){
				$scope.showForm = false;
			});
			
			$scope.submit = function(){
				var obj = {
					id: $scope.movies.length + 1, 
					title: $scope.title, 
					rating: $scope.rating, 
					directors:$scope.directors,
					cast:$scope.cast, 
					year: $scope.year,
					thumbnailUrl:$scope.url, 
					descriptionText: $scope.description
				};
				
				$scope.movies.push(obj);
			};
		}
	};
});

smdb.directive('actionBar', function(){
	return{
		restrict: 'E',
		transclude: false,
		replace: true,
		template:
			'<div class="{{actionPanel}}">'+
			'<img ng-click="expandActionPanel()" ng-show="showActionButton" src="http://joomlaxtc.com/images/doc/easyimage/Gear.png"/>'+
				'<input ng-show="showAddPanel" ng-click="expandAddPanel()" type="submit" value="Add Title"/><br>'+
				'<input ng-show="showModifyPanel" ng-click="modifyPanel()" type="submit" value="Modify Title"/><br>'+
				'<input ng-show="cancelActionButton" ng-click="shrinkActionPanel()" type="submit" value="Cancel"/><br>'+
			'</div>',
		controller: function($scope){
			$scope.showActionButton = true;
			$scope.showAddPanel = false;
			$scope.showModifyPanel = false;
			$scope.cancelActionButton = false;
			$scope.showActionButton = "showActionButton-shrink";
			$scope.actionPanel = "actionPanel-hide";
		
			$scope.expandActionPanel = function expandActionPanel(){
				if($scope.actionPanel == "actionPanel-hide"){
					$scope.showActionButton = false;
					$scope.actionPanel = "actionPanel-show";
					$scope.showAddPanel = true;
					$scope.showModifyPanel = true;
					$scope.cancelActionButton = true;
					$scope.showActionButton = false;
				}
			};
			
			$scope.shrinkActionPanel = function shrinkActionPanel(){
					$scope.actionPanel = "actionPanel-hide";
					$scope.showActionButton = true;
					$scope.showAddPanel = false;
					$scope.showModifyPanel = false;
					$scope.cancelActionButton = false;
					$scope.showActionButton = true;
			};
			
			$scope.modifyPanel = function modifyPanel(){
				$scope.$emit('EDIT_TITLE');			
			};
			
			$scope.expandAddPanel = function expandAddPanel(){
				$scope.$emit('ADD_TITLE');
			};
			
			$scope.shrinkActionPanel = function shrinkActionPanel(){
				$scope.$emit('CANCEL');			
			};
		}
	};
});

//Directive pour l'affichage des pages de films
smdb.directive('moviePage', function(){
	return {
		restrict: 'E',
		template: 
			'<div ng-show="showTitle(movieTitle.id)" class="movieTitleWrapper">'+
				'<div class="thumbnailWrapper">'+
					'<img src="{{movieTitle.thumbnailUrl}}" class="thumbnail" />'+
				'</div>'+
				'<div class="metaDataWrapper">'+
					'<p class="metaDataTitle">{{movieTitle.title}} ({{movieTitle.year}})</p>'+
					 '<img ng-repeat="n in getNumber(movieTitle.rating)" src="http://www.icon2s.com/img16/16x16-ios7-star-icon.png"/>'+
					 '<img ng-repeat="n in getNumber(10 - movieTitle.rating)"src="http://icons.iconarchive.com/icons/glyphish/glyphish/16/28-star-icon.png"/>'+
					 '<p class="metaDataInfo">Directors: </p>{{movieTitle.directors}} <br>'+
					 '<p class="metaDataInfo">Cast: </p>{{movieTitle.cast}} <br>'+
				'</div>'+
				'<div class="descriptionText">'+
					'<span class="descriptionTextLabel">Description: </span>'+
					'<span>{{movieTitle.descriptionText}}</span>'+
				'</div>'+
			'</div>',
		scope:{
			movieTitle: '=',
			currentPage: '='
		}, 
		link: function(scope, element, attrs){
						scope.getNumber = function getNumber(n){
							var tab = new Array(n);
							for(var i=0; i<n; i++){
								tab[i] = i;
							}
							return tab;
						};
						
						scope.showTitle = function(id){
							if(id == scope.currentPage){
								return true;
							} return false;
						};
				}
	};
});

/*Directive pour les touches de navigation inférieures*/
smdb.directive('menuBar', function(){
	return {
		restrict: 'E',
		template: 
			'<table class="menuTable">'+
				'<tr>'+
					'<td ng-click="previousTitle()"> {{previousIcon}} </td>'+
					'<td><input ng-model="currentPage" ng-model-options="{debounce:500}" type="text" placeholder="1-{{nbPage}}" maxlength="2" size="3" style="text-align:center"/></td>'+
					'<td ng-click="nextTitle()"> {{nextIcon}} </td>'+
				'</tr>'+
			'</table>',
			scope:{
				currentPage:'=',
				nbPage: '='
			},
			link: function(scope,element,attrs){
							scope.previousIcon = "<<";
							scope.nextIcon = ">>";

							scope.nextTitle = function nextTitle(page){
								scope.currentPage = parseInt(scope.currentPage,10);
								if(scope.currentPage < scope.nbPage){
										scope.currentPage += 1;
								}
							};
								
							scope.previousTitle = function previousTitle(page){
								scope.currentPage = parseInt(scope.currentPage,10);
								if(scope.currentPage > 1){
									scope.currentPage -= 1;								
								}
							};
							
							scope.$watch('currentPage', updateButtons);
							function updateButtons(){
								scope.previousIcon = "<<";
								scope.nextIcon = ">>";
								
								if(parseInt(scope.currentPage,10) == 1){
									scope.previousIcon = "...";
								}
								
								if(parseInt(scope.currentPage,10) == parseInt(scope.nbPage,10)){
									scope.nextIcon = "...";
								}
							};
				}
	};
});
