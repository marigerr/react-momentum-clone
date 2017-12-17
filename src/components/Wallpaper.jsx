import React from 'react';
import { getCurrentTime, localStorageKeyExists, addToLocalStorage, getFromLocalStorage, isNotANewDay, objIsInArray } from 'Scripts/utilities';
import { getUnsplashPhoto } from 'Scripts/apiCalls';
import 'Stylesheets/wallpaper.css';
import 'Images/photo-1476616853026-24c1f0309646.jpg';

export default class WallpaperInfo extends React.Component {
  constructor(props) {
    super(props);
    const haveTodaysPhoto = isNotANewDay(localStorage.wallpaperTimestamp, getCurrentTime());
    if (localStorage.wallpaperTimestamp === '0') {
      this.state = {
        divStyle: {
          backgroundImage: 'url(./assets/images/photo-1476616853026-24c1f0309646.jpg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no - repeat',
          backgroundSize: 'cover',
        },
        wallpaperData: getFromLocalStorage('wallpaper'),
        haveTodaysPhoto: true,
      };
      addToLocalStorage('wallpaperTimestamp', getCurrentTime());
    } else if (window.matchMedia('(min-width: 700px)').matches && haveTodaysPhoto) {
      const wallpaperData = getFromLocalStorage('wallpaper');
      this.state = {
        wallpaperData,
        divStyle: {
          backgroundImage: `url(${wallpaperData.urls.regular})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no - repeat',
          backgroundSize: 'cover',
        },
        haveTodaysPhoto: true,
      };
    } else {
      this.state = {
        divStyle: {},
        haveTodaysPhoto: false,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallpaperData && this.state !== nextProps.wallpaperData) {
      this.setState({
        divStyle: {
          backgroundImage: `url(${nextProps.wallpaperData.urls.regular})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no - repeat',
          backgroundSize: 'cover',
        },
      });
    }
  }

  componentDidMount() {
    this.props.updateWallpaperInfo(this.state.wallpaperData);
    if (window.matchMedia('(min-width: 700px)').matches && !this.state.haveTodaysPhoto) {
      getUnsplashPhoto()
        .then((result) => {
          const wallpaperData = result.data;
          wallpaperData.wallpaperLiked = localStorageKeyExists('wallpaper') &&
            objIsInArray(getFromLocalStorage('arrLikedWallpapers'), 'id', wallpaperData.id);
          this.setState({
            wallpaperData,
            divStyle: {
              backgroundImage: `url(${wallpaperData.urls.regular})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no - repeat',
              backgroundSize: 'cover',
            },
          });
          addToLocalStorage('wallpaper', wallpaperData);
          addToLocalStorage('wallpaperTimestamp', getCurrentTime());
          this.props.updateWallpaperInfo(wallpaperData);
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            divStyle: {
              backgroundImage: 'url(./assets/images/photo-1476616853026-24c1f0309646.jpg)',
              backgroundPosition: 'center',
              backgroundRepeat: 'no - repeat',
              backgroundSize: 'cover',
            },
          });
        });
    }
  }


  render() {
    return (
      <div className="wallpaper-container" style={this.state.divStyle}>
        {/* Demo for Desktop Only */}
      </div>
    );
  }
}
