import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';

import './custom-image-crop.css';
import './drop-crop.css';

import {
  image64toCanvasRef
} from '../helpers/ReusableUtils';


class ReactCropComponent extends Component {
  constructor (props) {
    super(props);
    this.imagePreviewCanvasRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.state = {
      previewText: 'Preview Canvas Crop',
      shouldHideProgressBar: true,
      shouldHideCrop: false,
      shouldHideButtons: false,
      shouldHideStartAgainButtons: true,
      imgSrc: null,
      imgSrcExt: null,
      crop: {}
    };

    this.handleOnCropChange = crop => {
      this.setState({ crop: crop });
    };

    this.handleOnCropComplete = (pixelCrop) => {
      const canvasRef = this.imagePreviewCanvasRef.current;
      const { imgSrc } = this.state;
      image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
    };

    this.handleSendClick = event => {
      event.preventDefault();
      const { imgSrc } = this.state;
      if (imgSrc) {
        const canvasRef = this.imagePreviewCanvasRef.current;
        const { imgSrcExt } = this.state;
        const imageData64 = canvasRef.toDataURL(imgSrcExt);

        // show progress bar
        this.setState({ shouldHideProgressBar: false });
        this.setState({ shouldHideCrop: true });
        this.setState({ shouldHideButtons: true });
        this.setState({ previewText: 'Looking for similar clothes...' });

        fetch('http://localhost:3000/submit', {
          method: 'POST',
          body: JSON.stringify({
            imageData64: imageData64
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          this.setState({ shouldHideProgressBar: true });
          this.setState({ shouldHideStartAgainButtons: false });

          const category = response.headers.get('category');
          this.setState({ previewText: `This is ${category}` });
        });
      }
    };

    this.handleClearToDefault = event => {
      if (event) event.preventDefault();
      const canvas = this.imagePreviewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.setState({
        previewText: 'Preview Canvas Crop',
        shouldHideProgressBar: true,
        shouldHideCrop: false,
        shouldHideButtons: false,
        shouldHideStartAgainButtons: true,
        imgSrc: null,
        imgSrcExt: null,
        crop: {}
      });
      this.fileInputRef.current.value = null;
    };
  }

  render() {
    const { imgSrc } = this.state;
    return (
      <div className="drop-crop-area">
        <div className="ReactCrop">
          <div className={this.state.shouldHideCrop ? 'hidden' : ''}>
            <ReactCrop
              className="ReactCrop"
              src={imgSrc}
              crop={this.state.crop}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />
          </div>
          <br />
          <p>{this.state.previewText}</p>
          <canvas ref={this.imagePreviewCanvasRef} />
          <div className={this.state.shouldHideButtons ? 'hidden' : ''}>
            <button onClick={this.handleSendClick}>Send</button>
            <button onClick={this.handleClearToDefault}>Clear</button>
          </div>
          <button
            className={this.state.shouldHideStartAgainButtons ? 'hidden' : ''}
            onClick={this.handleClearToDefault}
          >
            Search again
          </button>
        </div>
      </div>
    );
  }
}

export default ReactCropComponent;
