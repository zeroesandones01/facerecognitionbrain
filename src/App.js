
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import { useState } from 'react';
import './App.css';

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '255a124ad76d45a8963adf1bd235d63e';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'jlfclarifai';
  const APP_ID = 'test';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

 const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

//functional component
/**
 * Represents the main component of the application.
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState(null);
  const [route, setRoute] = useState('home');


  const calculateFaceLocation = (data) => {
    
    if (data && data.outputs && data.outputs[0] && data.outputs[0].data && data.outputs[0].data.regions && data.outputs[0].data.regions[0] && data.outputs[0].data.regions[0].region_info) {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      
     const image = document.getElementById('inputimage');
   
      const width = Number(image.width);
      const height = Number(image.height);
      // console.log(width, height);

      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    } else {
      console.error('Unexpected data structure', data);
      return null;
    }
    
    
   
  }

  const displayFaceBox = (box) => {
    //console.log(box);
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  /**
   * Handles the button submit event.
   */
  const onButtonSubmit = () => {
    //console.log(input);
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(input))
      .then(response => response.json())
      //.then(response => displayFaceBox(calculateFaceLocation(response)))
      .then(response => calculateFaceLocation(response))
      .then(result => {
        // Set the imageUrl state variable with the desired value
        //console.log(result.imageUrl);
        //console.log(input);
        if (result && result.outputs && result.outputs[0] && result.outputs[0].data) {
          // Set the imageUrl state variable with the desired value
          //setImageUrl(input);
          //console.log(result.outputs[0].data.regions);
          setImageUrl(result.outputs[0].data.regions);
        } else {
          console.error('Unexpected API response', result);
        }
        //setImageUrl(input);

        const regions = result.outputs[0].data.regions;

          regions.forEach(region => {
              // Accessing and rounding the bounding box values
              const boundingBox = region.region_info.bounding_box;
              const topRow = boundingBox.top_row.toFixed(3);
              const leftCol = boundingBox.left_col.toFixed(3);
              const bottomRow = boundingBox.bottom_row.toFixed(3);
              const rightCol = boundingBox.right_col.toFixed(3);

              region.data.concepts.forEach(concept => {
                  // Accessing and rounding the concept value
                  const name = concept.name;
                  const value = concept.value.toFixed(4);

                  console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);

                  
              });
          });
      })
      .catch(error => console.log('error', error));
  }


  const onRouteChange = (route) => {
    setRoute(route);
  }

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation onRouteChange={onRouteChange}/>
      {route === 'home' 
        ? <div>
        <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={onInputChange} 
            onButtonSubmit={onButtonSubmit}
          />
          {imageUrl ? (
            <FaceRecognition box={box} imageUrl={imageUrl} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        
        : (route === 'signin' ?
        <Signin onRouteChange={onRouteChange}/>
        : <Register onRouteChange={onRouteChange}/>
        )

        }
        
        

          
    </div>
  );
}

export default App;
