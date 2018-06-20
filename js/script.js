"use strict"

var mission = angular.module('mission', []);

mission.controller('controllerCompany', ( $scope ) => {
    
    var model = {
        allCompany: [
            {name: "Урал-Газ", adres: 'ул. Мяконьких 72', ogrn: '42543643643', inn: '777-777-777', dataReg: '12.15.2012г.'},
            {name: "Урал-Еда", adres: 'пер. Тупиковый 1', ogrn: '45657632657', inn: '34643643', dataReg: '2.10.2015г.'},
            {name: "ОАО 'Конь не валялся'", adres: 'ул. Пушкина 15', ogrn: '474868323657', inn: '4843543754', dataReg: '7.7.2007г.'},
            {name: "ООО Бабкины Семечки", adres: 'ул. Хлебная 7', ogrn: '5745', inn: '45754845', dataReg: '25.6.2018г.'},
            {name: "Урал-Толпливо", adres: 'прос-т. Васечкина 123', ogrn: '12345678', inn: '23465456945', dataReg: '1.1.2018г.'},
            
        ]
    }

    $scope.data = model;

    // добавление компании в список
    $scope.addNewCompany = (suggestion) => {
        $scope.data.allCompany.push( {
            name: suggestion.data.name.full,
            adres: suggestion.data.address.value,
            ogrn: suggestion.data.ogrn,
            inn: suggestion.data.inn,
            dataReg: timeConverter( suggestion.data.state.registration_date )
        } );

        // добавили, обновили данные, очистили input, закрыли модальное окно
        $scope.$apply();
        $("#party").val('');
        $('#myModal').modal('hide')
    }

    // удление компании из списка
    $scope.deleteCompany = (index) => {
        $scope.data.allCompany.splice( index,1 );
    }

    // перевод времени UNIX в человеческую дату
    function timeConverter( UNIX_timestamp ){
        var a = new Date( UNIX_timestamp );
        var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var time = date + '.' + month + '.' + year;
        return time;
    }

    // подключение API dadata.ru
    $("#party").suggestions({
        token: "482405f37dce8a16eb7f534f7dd14e6b67854273",
        type: "PARTY",
        count: 5,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function(suggestion) {
            $scope.addNewCompany(suggestion);
        }
    });

    // фокус на input рои открытии модального окна
    $( '#myModal' ).on( 'shown.bs.modal', function () {
        $( '#party' ).focus();
    })

}); // контроллер controllerCompany

// Закрыть модальное окно по Esc
mission.directive('onEsc', function() {
    return function( $scope, elm, attr ) {
        elm.bind('keydown', function( e ) {
            if ( e.keyCode === 27) {
                $scope.$apply( attr.onEsc );
            }
        });
    };
});
  
  // Сохранить при нажатии Enter
  mission.directive( 'onEnter', function() {
    return function( $scope, elm, attr ) {
        elm.bind( 'keypress', function( e ) {
            if ( e.keyCode === 13 ) {
                $scope.$apply( attr.onEnter );
            }
        });
    };
});

mission.directive( 'inlineEdit', function( $timeout ) {
    return {
        $scope: {
            modelDir: '=inlineEdit'
        },

        link: function( $scope, elm, attr ) {
            var previousValue;

            $scope.edit = function() {
                $scope.editMode = true;
                previousValue = $scope.company.adres;
            
                $timeout(function() {
                    elm.find( 'input' )[0].focus();
                }, 0, false );
            };

            $scope.save = function() {
                $scope.editMode = false;
                if( !$scope.modelDir ) $scope.company.adres = 'Адрес удален!';
                else {
                    $scope.company.adres = $scope.modelDir;
                }
            };

            $scope.cancel = function() {
                $scope.editMode = false;
                $scope.company.adres = previousValue;
            };
        }
    };
});



function log(str) {
    console.log( str );
}