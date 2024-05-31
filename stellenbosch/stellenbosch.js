// ArcGIs tutorial link: https://www.youtube.com/watch?v=HtYO9_V-zNs&t=101s
// for more info see: https://developers.arcgis.com/javascript
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
], function(Map, SceneView, MapView, esriConfig, VectorTileLayer, FeatureLayer, Graphic, GraphicsLayer){
    
    // API Key 
    esriConfig.apiKey = "AAPK2de9e22cda5b499989e23b3d5ad143ba_0f2ohTCqotSP6jt74-nUCRdqgoia6_7PAGWNA1SqfNaFw6hS45upwfMBxKNPMPW";

    // create a map
    var map = new Map ({
        basemap: "satellite",
        ground : "world-elevation" //makes it 3D
    });

    // Make a map view and bind it to map
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [18.81176, -33.89992, 3000], // coordinates for Stellenbosch with tilt factored in
            tilt: 70,
            heading: 120
        },
        
    });
    


    // Function to return to  explore data  View 
    function resetMapView(){
        view.goTo({
            position: [18.81176, -33.89992, 3000], // coordinates for Stellenbosch with tilt factored in
            tilt: 70,
            heading: 120
        });
        
        // Hide jonkershoek content 
        const jonkershoekView = document.getElementById('jonkershoek-content');
        jonkershoekView.style.display = 'none';

        // Display orginal Stellenbosch content again and hide jonkershoek content 
        const stellenboschView = document.querySelector('.content');
        stellenboschView.style.display = 'block';

        // Set orginal styling for explorer list by makinh data list container visible again
        const dataListContainer = document.getElementById('data-list-container');
        dataListContainer.style.display = 'block';
        dataListContainer.className = 'data-list';


        // make a 'back to stellenbosch button' after returning from exploring data in area
        let backToBoschButton = document.getElementById('back-to-bosch-btn');
        if (!backToBoschButton) {
            // Create "Back to the Bosch" button if it doesn't exist
            backToBoschButton = document.createElement('button');
            backToBoschButton.id = 'back-to-bosch-btn';
            backToBoschButton.textContent = 'Back to the Bosch';
            backToBoschButton.className = 'exploreBtn'; // Use the same class for styling
            backToBoschButton.onclick = showOrginalStellenbosch; // Set onclick to show original content
    
            // Append the button below the data list container
            const containerParent = dataListContainer.parentNode;
            containerParent.insertBefore(backToBoschButton, dataListContainer.nextSibling);
        }
    }

    
    // Function to return back to orginal stellenbosch view 
    function showOrginalStellenbosch(){
        view.goTo({
            position: [18.81176, -33.89992, 3000], // Original coordinates for Stellenbosch
            tilt: 70,
            heading: 120
        });
        
        // Show the original Stellenbosch content div
        const originalContentDiv = document.querySelector('.content');
        originalContentDiv.style.display = 'block'; // Make sure the original content is visible

        // Hide the data list container as we're now showing the original content
        const dataListContainer = document.getElementById('data-list-container');
        dataListContainer.style.display = 'none';

        // Hide the Jonkershoek content div
        const jonkershoekContentDiv = document.getElementById('jonkershoek-content');
        jonkershoekContentDiv.style.display = 'none'; // Hide the Jonkershoek content

        // hide the "Back to the Bosch"
        const backToBoschButton = document.getElementById('back-to-bosch-btn');
        if(backToBoschButton){
            backToBoschButton.style.display = 'none';
        }
    }



    // Adding function for "explore data sets" button
    function moveToJonkershoek() {
        view.goTo({
            position: {
                x: 18.8676000,
                y: -33.93462000,
                z: 3000
            },
            tilt: 75,
            heading: 120
        });
    
        // Hide the main content div and clear any previous dynamic content
        const contentDiv = document.querySelector('.content');
        contentDiv.style.display = 'none';
    
        // Check if the Jonkershoek content div already has content
        const jonkershoekContent = document.getElementById('jonkershoek-content');
        jonkershoekContent.innerHTML = ''; // Clear previous content if any
    
        // Dynamically create the Jonkershoek content
        const heading = document.createElement('h1');
        heading.textContent = 'Jonkershoek';
    
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Situated in the Western Cape of South Africa, the Jonkershoek Valley is distinguished by its Mediterranean climate, with an average annual temperature of 14.6°C and receiving about 893.89mm of rainfall, primarily from April to September. This climate supports the diverse ecosystems of the Cape Floristic Region, including the unique fynbos vegetation and afrotemperate forests. The valley\'s geology is marked by sandstone and quartzite, underlain by Cape granite, creating soils that are acid sandy loams, low in organic matter and phosphorus, yet high in infiltration capacity. Hydrologically, the valley has been the focus of long-term studies since the 1930s, monitoring streamflow from six catchments, essential for understanding the impacts of climate change on this biodiverse area.'; // Fill in with actual content
    
        jonkershoekContent.appendChild(heading);
        jonkershoekContent.appendChild(paragraph);
        
        // create new paragraph element for explorimg data points 
        const exploreParagraph = document.createElement('p');
        exploreParagraph.innerHTML = '<span style="color: #f37c37; font-size: 40px;">● </span>Move around & explore data points';
        exploreParagraph.style.cursor = 'pointer';
        jonkershoekContent.appendChild(exploreParagraph);

        // Make the Jonkershoek content visible
        jonkershoekContent.style.display = 'block';

        // add reset Map View button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Explore more data';
        resetButton.onclick = resetMapView;
        // add 'exploreBtn' class styling 
        resetButton.className = 'exploreBtn';
        // append reset button to Jonkershoek content 
        jonkershoekContent.appendChild(resetButton);
    }
    
    
    

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
            { name: 'Jonkershoek', onClick: moveToJonkershoek },
            { name: 'Area Rainfall Data', onClick: () => console.log('Area Rainfall Data Clicked') },
            { name: 'River Gauge Stations', onClick: () => console.log('River Gauge Stations Clicked') },
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
    

    // Adding point graphic feature layers for Jonkershoek Scene
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);
    
    // make a point
    const jonkershoekStationPoint = {
        type: "point",
        longitude: 18.953333,
        latitude: -33.984444
    };
    
    // construct a marker
    const jonkershoekStationMarker = { 
        type: "simple-marker",
        color: [266, 119, 20], // orange 
        outline: {
            color: [255, 255, 255], // white
            width: 1
        }
    };
    
    // make a pop up for the river station 
    const jonkershoekStationTemplate = {
        title: "{Name}",
        content: "{Description}"
    }

    const jonkershoekStationAttributes = {
        Name: "DWS Station G2E011",
        Description: "Jonkershoek @ Biesievlei   C.Area"
    }


    // combine point + marker + popup features to make new graphic
    const jonkershoekStationGraphic = new Graphic({
        geometry: jonkershoekStationPoint,
        symbol: jonkershoekStationMarker,
        attributes: jonkershoekStationAttributes,
        popupTemplate: jonkershoekStationTemplate
    });
    
    // add new graphic to graphics layer
    graphicsLayer.add(jonkershoekStationGraphic);



    // adding Twin Peaks feature
    const twinPeaksLayer = new GraphicsLayer();
    map.add(twinPeaksLayer);
    
    // make a point
    const twinPeaksPoint = {
        type: "point",
        longitude: 18.973333,
        latitude: -33.969167 
    };
    
    // construct a marker
    const twinPeaksMarker = { 
        type: "simple-marker",
        color: [266, 119, 20], // orange 
        outline: {
            color: [255, 255, 255], // white
            width: 1
        }
    };
    
    // make a pop up for the river station 
    const twinPeaksTemplate = {
        title: "{Name}",
        content: "<p>{Description}</p><img src='https://lh3.googleusercontent.com/Gh6oVTsWp9hfyyck8cDiaiUxm15bRaaQkThMETdCuakvEfS2AMRwXAtXFDwetp2nglI1wahcQgZs2Psk7Dn_Ge0zjJBD1XWH5z1EN_wac0YC_5_a93ECU0SQmRIl4JnpRwh0ZyrUQxs=w800' alt='View from the heights of the Twin Peaks by Ralph Pina (2010)' style='width: auto; max-width: 100%; max-height: 200px;' />"
    }

    const twinPeaksAttributes = {
        Name: "The Twin Peaks",
        Description: "Twin Peaks of Jonkershoek: where majestic mountains mirror each other, standing guard over nature's untamed beauty."
    }


    // combine point + marker + popup features to make new graphic
    const twinPeaksGraphic = new Graphic({
        geometry: twinPeaksPoint,
        symbol: twinPeaksMarker,
        attributes: twinPeaksAttributes,
        popupTemplate: twinPeaksTemplate
    });
    
    // add new graphic to graphics layer
    graphicsLayer.add(twinPeaksGraphic); 




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

