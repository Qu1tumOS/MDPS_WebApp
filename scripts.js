ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('myMap', {
        center: [56.19, 44.00],
        zoom: 10,
        controls: ['geolocationControl', 'trafficControl']
    });

    let previewPlacemark = null;
    let finalPlacemark = null;
    let addButton = document.getElementById('addButton');

    addButton.addEventListener('click', () => {
        if (finalPlacemark) {
            myMap.geoObjects.remove(finalPlacemark);
            finalPlacemark = null;
            addButton.textContent = 'Добавить метку';
            if (previewPlacemark) {
                myMap.geoObjects.remove(previewPlacemark);
                myMap.events.remove('boundschange', updatePreviewPlacemark);
            }
            previewPlacemark = null;
        } else {
            // Создаем временную метку для предпросмотра
            let centerCoords = myMap.getCenter();
            previewPlacemark = new ymaps.Placemark(centerCoords, {
                preset: 'twirl#blueStretchyIcon',
                draggable: false
            });
            myMap.geoObjects.add(previewPlacemark);

            // Привязываем функцию обновления позиции метки к событию boundschange
            myMap.events.add('boundschange', updatePreviewPlacemark);

            addButton.textContent = 'Подтвердить';
            addButton.addEventListener('click', confirmPlacemark);
        }
    });

    function updatePreviewPlacemark(e) {
        if (previewPlacemark) {
            previewPlacemark.geometry.setCoordinates(myMap.getCenter());
        }
    }

    function confirmPlacemark() {
        let centerCoords = myMap.getCenter();
        myMap.geoObjects.remove(previewPlacemark);
        previewPlacemark = null;
        myMap.events.remove('boundschange', updatePreviewPlacemark);

        finalPlacemark = new ymaps.Placemark(centerCoords, {
            hintContent: 'Метка',
            balloonContent: 'тут стоят пидарасы с палкой'
        }, {
            preset: 'twirl#blueStretchyIcon'
        });
        myMap.geoObjects.add(finalPlacemark);
        addButton.textContent = 'Добавить метку';
        addButton.removeEventListener('click', confirmPlacemark);
    }
}
