
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import { useState } from 'react';
import './App.css';

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
  //const [input, setInput] = useState('');
  const [setInput] = useState('');

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  }

  const onButtonSubmit = () =>{
    console.log('clickk');
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
