
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
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

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id



//CLASS COMPONENT //OLD
// class App extends Component{
//   constructor(){
//     super();
//     this.state = {
//       input: '',
//     }
//   }

//   onInputChange = (event) => {
//     console.log(event.target.value);
//   }


//   render() {
//     return (
    
//       <div className="App">
//         <ParticlesBg type="cobweb" bg={true} />
//         <Navigation />
//         <Logo />
//         <Rank />
//         <ImageLinkForm onInputChange={this.onInputChange}/>
//         {/*
        
//         <FaceRecognition />} */}
//       </div>
//     )
//   }
// };



//functional component
const App = () => {
  const [input, setInput] = useState('');
  //const [setInput] = useState('');

  const onInputChange = (event) => {
    
    setInput(event.target.value);
  }

  const onButtonSubmit = (event) =>{
    
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(input))
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
      onInputChange={onInputChange} 
      onButtonSubmit={onButtonSubmit}/>
      {/*
      <FaceRecognition /> */}
    </div>
  );
}

export default App;
