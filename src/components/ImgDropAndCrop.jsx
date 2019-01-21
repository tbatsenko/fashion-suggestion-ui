import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import LinearIndeterminate from './CircularDeterminate.jsx';
import ImageGrid from './ImageGrid.jsx';
import './custom-image-crop.css';
import './drop-crop.css';


import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from '../helpers/ReusableUtils';

const imageMaxSize = 1000000000; // bytes
const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim();
});
class ImgDropAndCrop extends Component {
  constructor(props) {
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
      crop: {
        // aspect: 1 / 1
      }, 
      imgPaths: []
    };
    this.verifyFile = files => {
      if (files && files.length > 0) {
        const currentFile = files[0];
        const currentFileType = currentFile.type;
        const currentFileSize = currentFile.size;
        if (currentFileSize > imageMaxSize) {
          alert(
            'This file is not allowed. ' +
              currentFileSize +
              ' bytes is too large'
          );
          return false;
        }
        if (!acceptedFileTypesArray.includes(currentFileType)) {
          alert('This file is not allowed. Only images are allowed.');
          return false;
        }
        return true;
      }
    };

    this.handleOnDrop = (files, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        this.verifyFile(rejectedFiles);
      }

      if (files && files.length > 0) {
        const isVerified = this.verifyFile(files);
        if (isVerified) {
          // imageBase64Data
          const currentFile = files[0];
          const myFileItemReader = new FileReader();
          myFileItemReader.addEventListener(
            'load',
            () => {
              // console.log(myFileItemReader.result)
              const myResult = myFileItemReader.result;
              this.setState({
                imgSrc: myResult,
                imgSrcExt: extractImageFileExtensionFromBase64(myResult)
              });
            },
            false
          );

          myFileItemReader.readAsDataURL(currentFile);
        }
      }
    };

    this.handleImageLoaded = image => {
      //console.log(image)
    };
    this.handleOnCropChange = crop => {
      this.setState({ crop: crop });
    };
    this.handleOnCropComplete = (crop, pixelCrop) => {
      //console.log(crop, pixelCrop)

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

        const myFilename = 'previewFile.' + imgSrcExt;

        // file to be uploaded
        const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);

        // show progress bar
        this.setState({ shouldHideProgressBar: false });
        this.setState({ shouldHideCrop: true });
        this.setState({ shouldHideButtons: true });
        this.setState({ previewText: 'Looking for similar clothes...' });


        fetch('http://localhost:3000/submit', {
          method: 'POST',
          body: JSON.stringify({
            imageData64: imageData64
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            this.setState({ shouldHideProgressBar: true });
            this.setState({ shouldHideStartAgainButtons: false });

            const category = response.headers.get('category');
            // const img_paths = response.headers.get('img_paths');
            const imgPaths = ['./static/assets/morning.jpg','./static/assets/clothes.jpg', './static/assets/clothes-bg.jpg', './static/assets/morning.jpg','./static/assets/clothes.jpg'];

            this.setState({ imgPaths: imgPaths });

            imgPaths.forEach(path => {

            });

            this.setState({ previewText: `This are hardcoded similar images.` });
          }
          );
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
        crop: {
          // aspect: 1 / 1
        }
      });
      this.fileInputRef.current.value = null;
    };

    this.handleFileSelect = event => {
      // console.log(event)
      const files = event.target.files;
      if (files && files.length > 0) {
        const isVerified = this.verifyFile(files);
        if (isVerified) {
          // imageBase64Data
          const currentFile = files[0];
          const myFileItemReader = new FileReader();
          myFileItemReader.addEventListener(
            'load',
            () => {
              // console.log(myFileItemReader.result)
              const myResult = myFileItemReader.result;
              this.setState({
                imgSrc: myResult,
                imgSrcExt: extractImageFileExtensionFromBase64(myResult)
              });
            },
            false
          );

          myFileItemReader.readAsDataURL(currentFile);
        }
      }
    };
  }

  render() {
    const { imgSrc } = this.state;
    return (
      <div className="drop-crop-area">
        <button className={this.state.shouldHideButtons ? 'hidden' : ''}>click</button>
        <input
          ref={this.fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={false}
          onChange={this.handleFileSelect}
        />
        {imgSrc !== null ? (
          <div className="ReactCrop">
            <div className={this.state.shouldHideCrop ? 'hidden' : ''}>
            <ReactCrop 
              className="ReactCrop"
              src={imgSrc}
              crop={this.state.crop}
              onImageLoaded={this.handleImageLoaded}
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
            >Search again</button>
            <div className={this.state.shouldHideStartAgainButtons ? 'hidden' : ''}>
              <ImageGrid
                imgPaths={this.state.imgPaths}
              />
            </div>
            
          </div>
        ) : (
          <Dropzone
            onDrop={this.handleOnDrop}
            accept={acceptedFileTypes}
            multiple={false}
            maxSize={imageMaxSize}
          >
            {({ getRootProps }) => (
              <div {...getRootProps()}>
                <p>Drop files here, or click to select files</p>
              </div>
            )}
            </Dropzone>
          )}
        <div className={this.state.shouldHideProgressBar ? 'hidden' : ''}>
          <LinearIndeterminate />

        </div>
        
      </div>
    );
  }
}

export default ImgDropAndCrop;
