import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './drop-crop.css';
import {
  extractImageFileExtensionFromBase64,
} from '../helpers/ReusableUtils';

const IMAGE_MAX_SIZE = 1000000000; // bytes
const ACCEPTED_FILE_TYPES = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const ACCEPTED_FILE_TYPES_ARRAY = ACCEPTED_FILE_TYPES.split(',').map(item => {
  return item.trim();
});

class DropzoneComponent extends Component {
  constructor (props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      imgSrc: null,
      imgSrcExt: null
    };

    this.verifyFile = files => {
      if (files && files.length > 0) {
        const currentFile = files[0];
        const currentFileType = currentFile.type;
        const currentFileSize = currentFile.size;
        if (currentFileSize > IMAGE_MAX_SIZE) {
          alert(
            'This file is not allowed. ' +
              currentFileSize +
              ' bytes is too large'
          );
          return false;
        }
        if (!ACCEPTED_FILE_TYPES_ARRAY.includes(currentFileType)) {
          alert('This file is not allowed. Only images are allowed.');
          return false;
        }
        return true;
      }
    };

    this.handleOnDrop = (files, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) this.verifyFile(rejectedFiles);
      const event = { target: { files: files } };
      this.handleFileSelect(event);
    };

    this.handleFileSelect = event => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const isVerified = this.verifyFile(files);
        if (isVerified) {
          const currentFile = files[0];
          const myFileItemReader = new FileReader();
          myFileItemReader.addEventListener(
            'load',
            () => {
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
    return (
      <div className="drop-crop-area">
        <button className={this.state.shouldHideButtons ? 'hidden' : ''}>click</button>
        <input
          ref={this.fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          multiple={false}
          onChange={this.handleFileSelect}
        />
        <Dropzone
          onDrop={this.handleOnDrop}
          accept={ACCEPTED_FILE_TYPES}
          multiple={false}
          maxSize={IMAGE_MAX_SIZE}
        >
        {({ getRootProps }) => (
          <div {...getRootProps()}>
            <p>Drop files here, or click to select files</p>
          </div>
        )}
        </Dropzone>
      </div>
    );
  }
}

export default DropzoneComponent;
