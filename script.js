// ArcGIs tutorial link: https://www.youtube.com/watch?v=HtYO9_V-zNs&t=101s
// for more info see: https://developers.arcgis.com/javascript
// explore main data sets here: https://cga-sun.maps.arcgis.com/home/gallery.html?sortField=relevance&sortOrder=desc
// explore datasets here: https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services
// for esri dev. dashboard and api key access: https://developers.arcgis.com/dashboard/#


// main script for map work
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/views/MapView",
    "esri/config",
    "esri/layers/VectorTileLayer",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
], 
(
    Map, 
    SceneView, 
    MapView, 
    esriConfig, 
    VectorTileLayer, 
    FeatureLayer, 
    Graphic, 
    GraphicsLayer,
    GeoJSONLayer
) => {

    esriConfig.apiKey ="AAPK231ad1a6e46240428998920e3aacd8acyoXmgdYFW2eLwf5XaJTRKuU4S0OGUCofvqZnvSqYruqlosfgR7TkEyqRYTSB0bE_";

    const map = new Map({
        basemap: "dark-gray-vector"
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [23.7103, -44.3411, 1932626],
            tilt: 40
        }
    });

    // delcare any feature layers globally 
    let wcBoundary; 
    let dwsStations;

   // Function to create the dataset list and append it to the content div
   function showDataSets() {
       console.log('Executing showDataSets function...');

        // Select the content and data-list-container divs
        const contentDiv = document.querySelector('.content');
        const dataListContainer = document.getElementById('data-list-container');
    
        // Hide the existing content except for the dataListContainer
        Array.from(contentDiv.children).forEach(child => {
            if (child.id !== 'data-list-container') {
            child.style.display = 'none';
            }
       });
    
        // Clear previous list if it exists and make the container visible
        dataListContainer.innerHTML = '';
        dataListContainer.style.display = 'block';
    
        // Define dataset names and associated functions
        const dataSets = [
            { name: 'Western Cape', onClick: moveToWC}, //create moveToWC function and then add 
            { name: 'Eastern Cape', onClick: () => console.log('Area Rainfall Data Clicked') },
            { name: 'Free State', onClick: () => console.log('Eastern Cape Clicked') },
            { name: 'KZN', onClick: () => console.log('KZN Clicked') },
            { name: 'Limpopo', onClick: () => console.log('Limpopo Clicked') },
            { name: 'Mpumalanga', onClick: () => console.log('Mpumalanga Clicked') },
            { name: 'North West', onClick: () => console.log('North West Clicked') },
            { name: 'Northern Cape', onClick: () => console.log('Northern Cape Clicked') },
        ];

        // Create and append list items to the container
        const dataList = document.createElement('ul');
        dataList.id = 'data-list';
        dataSets.forEach(dataSet => {
            const listItem = document.createElement('li');
            listItem.textContent = dataSet.name;
            listItem.onclick = dataSet.onClick; // Assign click handler
            dataList.appendChild(listItem);
        });
        dataListContainer.appendChild(dataList);
    }

    // Initialize "explore data sets" button 
    const exploreBtn = document.getElementById('explore-btn');
    exploreBtn.addEventListener('click', showDataSets);
    

    // make a Move to Western Cape (WC) function 
    function moveToWC(){
        view.goTo({
            position: [18.4241, -38.2249, 1032626],
            tilt: 30
        })

        // hide explore list content 
        const mainPageContent = document.querySelector('.content');
        mainPageContent.style.display = 'none';

        // Check if the WC content div already has content
        const wcContent = document.getElementById('wc-content');
        wcContent.innerHTML = ''; // Clear previous content if any
    
        // Dynamically create the WC content
        const wcheading = document.createElement('h1');
        wcheading.textContent = 'Western Cape';
    
        const wcparagraph = document.createElement('p');
        wcparagraph.textContent = 'The Western Cape of South Africa experiences a Mediterranean climate along its coastal areas, characterized by wet winters and dry summers, while the interior sees more variable rainfall and cooler temperatures, influenced by its proximity to both the Atlantic and Indian Oceans.'; // Fill in with actual content
    
        wcContent.appendChild(wcheading);
        wcContent.appendChild(wcparagraph);

        // create list elements to show feature layers for DWS Stations of the WC
        const wcDWSBtn = document.createElement('button');
        wcDWSBtn.textContent = 'DWS River Gauge Stations';
        wcDWSBtn.onclick = showDwsStations;
        wcDWSBtn.className = 'exploreBtn';
        wcContent.appendChild(wcDWSBtn);

        

        // create new paragraph element for explorimg data points 
        const infoParagraph = document.createElement('p');
        infoParagraph.innerHTML = '<span style="color: #f37c37; font-size: 40px;">● </span>Move around & explore data points';
        infoParagraph.style.cursor = 'pointer';
        wcContent.appendChild(infoParagraph);

        // Make the wc content visible
        wcContent.style.display = 'block';

        // add reset Map View button
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Return to orbit';
        returnButton.onclick = resetMapView;
        // add 'exploreBtn' class styling 
        returnButton.className = 'exploreBtn';
        // append reset button to wc content 
        wcContent.appendChild(returnButton);

        // add feature layer here of western cape province outline 
        wcBoundary = new FeatureLayer({
            portalItem: {
                id: '6e6d2fd16bf745a888d8d1ec62764277' // Assuming this is the ID for the Western Cape outline layer
            },
            renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-line", // autocasts as new SimpleLineSymbol()
                    color: "#f37c37", // Orange color
                    width: "2px",
                    style: "solid"
                }
            },
            labelingInfo: [] //remove labelling 
        });
        wcBoundary.effect = "bloom(6, 0.5px, 0.1)";
        map.add(wcBoundary);

    }

    // Function to return to  explore data  View 
    function resetMapView(){
        view.goTo({
            position: [23.7103, -44.3411, 1932626], 
            tilt: 40,
        });
        
        // Hide wc content 
        const wcView = document.getElementById('wc-content');
        wcView.style.display = 'none';

        // Display orginal  content again and hide wccontent 
        const homeView = document.querySelector('.content');
        homeView.style.display = 'block';

        // Set orginal styling for explorer list by makinh data list container visible again
        const dataListContainer = document.getElementById('data-list-container');
        dataListContainer.style = '' // importnat to get the styling to clear before applying again
        dataListContainer.style.display = 'block';
        dataListContainer.className = 'data-list-container'; // apply styling 

        // remove western cape boundary outline
        if(wcBoundary){
            map.layers.remove(wcBoundary);
        }
        
    }
    


    // create a fucntion to show DWS river stations for WC 
    function showDwsStations(){
        dwsStations = new FeatureLayer({
            portalItem: {
                url: 'https://cga-sun.maps.arcgis.com/home/item.html?id=dc27ba6c50234d388138a6a09b4f0e75'
            }
        })
        map.add(dwsStations);
    }
  

    

});


// interactive nav-menu
function myMenuFunction() {
    console.log("button clicked")
    var menu = document.getElementById("navMenu");
    var closeButton = document.querySelector(".close-btn");

    if(menu.className === "nav-menu") {
        menu.className += " responsive";
        closeButton.style.display = "block"; // Show the close button
    } else {
        menu.className = "nav-menu";
        closeButton.style.display = "none"; // Hide the close button
    }
}


// intro screen
let intro = document.querySelector('.intro'); 
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.logo');

//event listener
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() =>{
        logoSpan.forEach((span, idx) => {
            setTimeout(() =>{
                span.classList.add('active');
            }, (idx + 1) * 400)
        });
        setTimeout(() => {
            logoSpan.forEach((span, idx) => { // Corrected to 'span' instead of 'san'
                setTimeout(() => {
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx + 1) * 50)
            });
            setTimeout(() => {
                intro.style.top = '-100vh'; // Changed 'computedStyleMap.top' to 'style.top'
            }, 2000); // Corrected timeout value
        }, 2000); // Corrected timeout value
    });
});