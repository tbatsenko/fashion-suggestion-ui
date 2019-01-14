import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import image from '../assets/clothes.jpg';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  }
});

function ImageGridList(props) {
  // const tileData = [
  //   {
  //     img: './static/assets/morning.jpg',
  //     title: 'Image',
  //     author: 'author',
  //     cols: 2
  //   },
  //   {
  //     img: './static/assets/clothes.jpg',
  //     title: 'Image',
  //     author: 'author',
  //     cols: 2
  //   }
  // ];
  const tileData = [];
  props.imgPaths.forEach(path => {
    let currImage = {
      img: path,
      cols: 1
    };
    tileData.push(currImage);
  });
  const { classes } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={250} className={classes.gridList} cols={3}>
        {tileData.map(tile => (
          <GridListTile key={tile.img} cols={tile.cols || 1}>
            <img src={tile.img} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageGridList);
