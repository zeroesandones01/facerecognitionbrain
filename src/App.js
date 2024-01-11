
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import { useEffect, useState } from 'react';
import './App.css';

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'd5e368a447be4417b67d25aa623eca03';
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
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    
    setUser(Object.assign(user, { id: data.id, name: data.name, email: data.email, entries: data.entries, joined: data.joined }));
  }

  const calculateFaceLocation = (data) => {

    //if (data && data.outputs && data.outputs[0] && data.outputs[0].data && data.outputs[0].data.regions && data.outputs[0].data.regions[0] && data.outputs[0].data.regions[0].region_info) {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputimage');

    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
    // } else {
    //   console.error('Unexpected data structure', data);
    //   return null;
    // }
  }

  const displayFaceBox = (box) => {
    // console.log(box);
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  /**
   * Handles the button submit event.
   */
  // const onButtonSubmit = () => {
  //   setImageUrl(input);
  //   //console.log(input);
  //   fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(input))
  //     .then(response => response.json())
  //     .then(response => displayFaceBox(calculateFaceLocation(response))

  //     )
  //     .catch(error => console.log('error', error));
  // }

  const onButtonSubmit = () => {
    setImageUrl(input);
    //console.log(input);
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(input))
      .then(response => response.json())
      .then(response => {
        displayFaceBox(calculateFaceLocation(response))
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setUser(Object.assign(user, { entries: count }))
            })
        }

      })
      .catch(error => console.log('error', error));
  }


  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
      {/* <ParticlesBg type="cobweb" bg={true} /> */}
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home'
        ? <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />

          <FaceRecognition imageUrl={imageUrl} box={box} />

        </div>

        : (route === 'signin' ?
          <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
          : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        )

      }




    </div>
  );
}

export default App;
