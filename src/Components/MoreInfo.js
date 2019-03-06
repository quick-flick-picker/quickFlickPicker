import React, { Component } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import {Link} from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronCircleLeft, faPlusCircle)

const apiKey = "220ba76687a248fe4b74726d993ed22f";

class MoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {},
      description: "",
      directors: "",
      cast: "",
      genres: "",
      trailer: ""
    };
  }
  //make call to API for specific film details of movie that the user selected
  componentDidMount = () => {
    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/movie/${
        this.props.match.params.movieId
      }`,
      responseType: "json",
      params: {
        api_key: apiKey,
        append_to_response: "videos,credits"
      }
    }).then(response => {
      const crew = response.data.credits.crew;
      const cast = response.data.credits.cast;
      const video = response.data.videos.results[0].key;
      const genre = response.data.genres;

      // These are the returned info:
      const description = response.data.overview;
      const genreString = genre
        .map(name => {
          return name.name;
        })
        .join(", ");
      const director = crew
        .filter(member => {
          return member.job === "Director";
        })
        .map(name => {
          return name.name;
        })
        .join(", ");
      const topBilled = [];
      for (let i = 0; i < 5; i++) {
        topBilled.push(cast[i].name);
      }
      //setting state to be returned values
      this.setState({
        movie: response.data,
        description: description,
        directors: director,
        cast: topBilled.join(", "),
        genres: genreString,
        trailer: video
      });
    });
  };
  // using props to create a div with more info about the selected film
  render() {
    return (
      <div className="moreInfo">
      <div>
      <Link to='/'>
      <FontAwesomeIcon icon="chevron-circle-left" />
      </Link>
      <button><FontAwesomeIcon icon='plus-circle'/></button>
          <h2>{this.state.movie.title}</h2>
          <h3>{this.state.movie.tagline}</h3>
        </div>
        <YouTube
          videoId={this.state.trailer}
          // these are the options for the video opts={opts} onReady={this._onReady}
        />
        <div>
          <p>
            <span>Description:</span>
            {this.state.movie.overview}
          </p>
          <p>
            <span>Cast:</span>
            {this.state.cast}
          </p>
          <p>
            <span>Directors:</span>
            {this.state.directors}
          </p>
          <p>
            <span>Genres:</span>
            {this.state.genres}
          </p>
        </div>
      </div>
    );
  }
}

export default MoreInfo;
