import $ from 'jquery';
import transitions from 'transitions';
import {loadGoogleMaps} from '../third-party-script-loaders';

const contactsController = {
    init: function (app, resolver) {
        const view = app.view;

        function initMap() {
            let map;
            let setCenterWithOffset= function(latlng, offsetX, offsetY) {
                let ov = new google.maps.OverlayView();
                ov.onAdd = function() {
                    let proj = ov.getProjection();
                    let aPoint = proj.fromLatLngToContainerPixel(latlng);
                    aPoint.x = aPoint.x+offsetX;
                    aPoint.y = aPoint.y+offsetY;
                    map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
                };
                ov.draw = function() {};
                ov.setMap(map);
            };
            let uluru = {lat: 51.512140, lng: -0.141629};
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: uluru,
                mapTypeControl: false,
                scrollwheel: false,
                zoomControl:false,
                fullscreenControl:false,
                streetViewControl:false,
                styles: [
                    {
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#616161"
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#bdbdbd"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#eeeeee"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#757575"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#e5e5e5"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#9e9e9e"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#757575"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#dadada"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#616161"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#9e9e9e"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#e5e5e5"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#eeeeee"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#c9c9c9"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#9e9e9e"
                            }
                        ]
                    }
                ]
            });

            let icon = {
                url:'/homepage/assets/img/marker.svg',
                scaledSize: new google.maps.Size(25, 46)
            };

            let marker = new google.maps.Marker({
                position: uluru,
                map: map,
                optimized: false,
                icon: icon
            });

            google.maps.event.addDomListener(window, "resize", function() {
                google.maps.event.trigger(map, "resize");
                if ( window.innerWidth < 768 ) setCenterWithOffset( { lat: function() { return uluru.lat; }, lng: function() { return uluru.lng; } }, 0, 160 );
                else setCenterWithOffset( { lat: function() { return uluru.lat; }, lng: function() { return uluru.lng; } }, 0, 20 );
            });

            if ( window.innerWidth < 768 ) setCenterWithOffset( { lat: function() { return uluru.lat; }, lng: function() { return uluru.lng; } }, 0, 160 );
            else setCenterWithOffset( { lat: function() { return uluru.lat; }, lng: function() { return uluru.lng; } }, 0, 20 );
        }

        loadGoogleMaps(initMap);

        resolver.resolve();
    },
    enter: function (app, resolver) {
        let tl;

        // Page animations
        tl = transitions.contacts.enter(app.view);
        this.magic = transitions.contacts.magic(app.view);

        app.view.find('.dsx-contacts-info-email-wrapper button').on('click', () => { window.Intercom && Intercom('showNewMessage')});

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },
    leave: function (app, resolver) {
        const view = app.view;

        this.magic && this.magic.destroy();

        resolver.resolve();
    }
};

export default contactsController;
