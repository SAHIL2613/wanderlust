
    mapboxgl.accessToken =mapToken;


    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style:"mapbox://styles/mapbox/streets-v12",
      center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 10 ,// starting zoom
    });

    const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<p>Exact location provided after booking</p>`);

     new mapboxgl.Marker({color:'red'})
    .setLngLat(coordinates)  //listing.geometry.coordinates
    .setPopup(popup)
    .addTo(map);

   
