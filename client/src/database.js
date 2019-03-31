import React, { Component } from 'react';
import axios from 'axios';
import Stories from './components/ShowStories'
// import TableRow from './TableRow';

export default class Database extends Component {

  constructor(props) {
      super(props);
      
      if(this.props.match.params.id === 'chant'){ this.URL = '/chantnews'; this.proceduralDBName = 'Chant'} 
      else if(this.props.match.params.id === 'ritual'){this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual'}
      
      this.state = {
        editPath: "/"+this.props.match.params.id+"/edit",
        news: [],
        tag: '',
        multiTag: []
      };

      this.handleInput = this.handleInput.bind(this);
      this.searchTag = this.searchTag.bind(this);
      this.searchMultiTag = this.searchMultiTag.bind(this);
      this.getNewStories = this.getNewStories.bind(this);
      this.getSkippedStories = this.getSkippedStories.bind(this);
    }
    componentDidMount(){
      axios.get(this.URL+'/categorised')
        .then(response => {
          this.setState({ news: response.data });
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.location !== this.props.location){
        window.location.reload();
      }
    }
    handleInput = e => {
      if(e.target.value.includes(',')){
        var tags = e.target.value.toLowerCase().replace(/\s/g, '').split(',')
        this.setState({multiTag: tags}, this.searchMultiTag)
      }else{
        this.setState({tag: e.target.value}, this.searchTag); 
      }
    }
    searchMultiTag(){
      console.log(this.state.multiTag)
      axios.get(this.URL+'/search/multitag/'+this.state.multiTag)
        .then(response => {
          if(response.data.length>0){
            this.setState({ news: response.data });
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    //search method for database
    searchTag(e){
      if(this.state.tag===''){
        axios.get(this.URL+'/categorised')
          .then(response => {
            this.setState({ news: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
      }

      else{
        axios.get(this.URL+'/search/'+this.state.tag)
          .then(response => {
            this.setState({ news: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
      }   
    }
    getNewStories(){
      console.log(this.URL+'/new/all')
      axios.get(this.URL+'/new/all')
        .then(response => {
          this.setState({ news: response.data });
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    getSkippedStories(){
      axios.get(this.URL+'/search/skipped')
          .then(response => {
            this.setState({ news: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    render() {
      return (
        <div>
          <h3 align="center">{this.proceduralDBName} stories</h3>
          <div>
            <button className="borders btn btn-outline-dark btn-sml" onClick={this.searchTag}>Categorised</button>
            <button className="borders btn btn-outline-dark btn-sml" onClick={this.getNewStories}>New</button>
            <button className="borders btn btn-outline-dark btn-sml" onClick={this.getSkippedStories}>Skipped</button>
            <br></br><p></p>
          </div>
          <form className="form-inline" onSubmit={this.searchTag}>
            <input className="form-control mr-sm-2" onChange={this.handleInput} type="search" placeholder="tag (e.g religion)" aria-label="Search" style={{width:"90%"}}></input>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" style={{width: "9%"}}>Search</button>
          </form>

          <Stories
              URL={this.URL}
              editPath={this.state.editPath}
              stories={this.state.news}>
          </Stories>
          
        </div>
      );
    }
  }