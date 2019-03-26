import React, { Component } from 'react';
import axios from 'axios';
import Stories from './components/ShowStories'
// import TableRow from './TableRow';

export default class Database extends Component {

  constructor(props) {
      super(props);
      // if(this.props.match.params.id === 'chant'){ this.URL = 'http:/localhost:4000/chantnews'; this.proceduralDBName='Chant'} 
      // else if(this.props.match.params.id === 'ritual'){this.URL = 'http://localhost:4000/ritualnews'; this.proceduralDBName='Ritual'}
     
      if(this.props.match.params.id === 'chant'){ this.URL = '/chantnews'; this.proceduralDBName = 'Chant'} 
      else if(this.props.match.params.id === 'ritual'){this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual'}
      
      this.state = {
        editPath: "/"+this.props.match.params.id+"/edit",
        news: [],
        tag: ''
      };

      this.handleInput = this.handleInput.bind(this);
      this.searchTag = this.searchTag.bind(this);
    }
    componentDidMount(){
      axios.get(this.URL+'/')
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
      this.setState({tag: e.target.value}); 
    }
    //search method for database
    searchTag(e){
      if(this.state.tag===''){
        axios.get(this.URL+'/')
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
      e.preventDefault();
    }

    render() {
      return (
        <div>
          <h3 align="center">{this.proceduralDBName} stories</h3>
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