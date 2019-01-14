import React from 'react';
import ReactDOM from 'react-dom';
import ImgDropAndCrop from './components/ImgDropAndCrop.jsx';
import './app.css';


class App extends React.Component {
    render() {
        return (
            <div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
                <h2>Where to buy it?</h2>
                <p>Welcome! Our project helps you to find clothes similar to the one that you see on the image.</p>
                <p>Just provide us with the pic you like and let's see what we've got for you!</p>
                <ImgDropAndCrop/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
