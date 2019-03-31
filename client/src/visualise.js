import React, { Component } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import TopTags from './components/VisualiseTopTags'
import ShowStories from './components/ShowStories'
import DashBoard from './components/VisualiseDashboard'

export default class Visualise extends Component {

    constructor(props) {
        super(props);

        if(this.props.match.params.id === 'chant'){ this.URL = '/chantnews'; this.proceduralDBName = 'Chant'} 
        else if(this.props.match.params.id === 'ritual'){this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual'}
        
        this.state = {
            editPath: "/"+this.props.match.params.id+"/edit",
            news: [],
            firstOccurence: '',
            lastOccurence: '',
            mostOccurences: '',
            freqAssTags: [],
            similarTags:[],
            tag: ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.searchTag = this.searchTag.bind(this);
        this.searchMultiTag = this.searchMultiTag.bind(this);
      }
    componentDidMount(){
      axios.get(this.URL+'/search/'+this.state.tag)
        .then(response => {
          this.setState({ news: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.location !== this.props.location){
        window.location.reload();
      }
    }
    handleInput = e => {
      if(e.target.value !==''){
        var tagsString = this.state.tag+','+e.target.value.toLowerCase().replace(/\s/g, '')
        var tagsArray = tagsString.split(',')
        this.setState({multiTag: tagsArray}, this.searchMultiTag)
      }else{
        this.getTagDashBoard(this.state.tag)
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
    }
    getSimilarTags(searchTag){
      var myTags = [];
      // eslint-disable-next-line
      this.state.similarTags.map(function(object,i){ 
          if(object.tags.length !== 0){
              myTags.push(...object.tags)}
      });
      var selectedTags = [];
      myTags.filter(function(element){
          if(element.includes(searchTag)) {
            if(!selectedTags.includes(element)){
              if(element!==searchTag){
                selectedTags.push(element)
              }
            }
          }
        });
        console.log(selectedTags)
        this.setState({similarTags:selectedTags})
    }
    getTags(){
      var myTags = [];
      // eslint-disable-next-line
      this.state.news.map(function(object,i){
          if(object.tags.length !== 0){
              myTags.push(...object.tags)}
      });
      return myTags
    }
    getFrequentlyAssociated(){
      var tags = this.getTags();
      var toptags = this.countTagOccurences(tags).slice(1,6)
      console.log(toptags)
      this.setState({freqAssTags: toptags})
    }
    countTagOccurences(tags) {
        var counts = {}
        var i;
        var value;
        for (i = 0; i < tags.length; i++) {
            if( tags[i]!=='skipped'){
                value = tags[i];
                if (typeof counts[value] === "undefined") {
                    counts[value] = 1;
                } else {
                    counts[value]++;
                }
            }
        }
        var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
        return keysSorted      
    }
    setTags(tags) {    
        this.setState({
            similarTags: tags
        }, console.log("TAGS"+ this.state.similarTags))
    }
    getOccurenceOfTag(){
      var first = this.state.news[this.state.news.length-1]
      var last = this.state.news[0]
      var dates = [];
      this.state.news.map(function(object,i){
          var date = object.published.split('-')
          // console.log(date)
          dates.push(date[0])
      });
      var topDate = this.countTagOccurences(dates)
      this.setState({
        firstOccurence: first.published,
        lastOccurence: last.published,
        mostOccurences: topDate[0]
      })
    }
    getInfo(){
      this.getFrequentlyAssociated();
      this.getOccurenceOfTag();
    }
    getTagDashBoard = searchTag =>{
      console.log(searchTag)
      axios.get(this.URL+'/search/'+searchTag)
        .then(response => {
          this.setState({ news: response.data, tag: searchTag }, this.getInfo);
        })
        .catch(function (error) {
          console.log(error);
        })
      axios.get(this.URL+'/searchsimilar/'+searchTag).then(response => {
          this.setState({ similarTags: response.data }
        , () => this.getSimilarTags(this.state.tag));
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    getClickableTag = tag =>{
      return(
          <div>
              {/* <button className="btn" onClick={() => this.props.getTagDashBoard(tag)}>{tag}</button> */}{tag}
          </div>
      )
    }
    render() {
      // var similarTags = this.state.similarTags.slice(0, 20).map(this.getClickableTag)
      var similarTags = this.state.similarTags.toString();
      var freqAssTags = this.state.freqAssTags.toString();
      var firstOccurence = this.state.firstOccurence.toString();
      var lastOccurence = this.state.lastOccurence.toString();
      var mostOccurences = this.state.mostOccurences.toString();
        return (  
          <div className="d-flex">

            <div style={{width: "75%", margin:10}} className="borders">
            <h1>{this.proceduralDBName} Visualise Dashboard</h1>
              <div className="toprow d-flex border" style={{position:'relative'}}><br></br>
                <div className="stats d-flex align-items-start flex-column" style={{width: "75%",margin:15}}>
                    <p><b>First occurence of tag: </b>{firstOccurence}</p>
                    <p><b>Most recent occurence of tag: </b>{lastOccurence}</p>
                    <p><b>Date with most tag occurences:</b> {mostOccurences}</p>
                    <p><b>Frequently associated tags:</b> {freqAssTags}</p>
                    <p><b>Similar tags: </b>{similarTags}</p>
                    <br></br>
                </div>
                <div style={{position:'absolute', bottom: 5, right: 10}}>
                  <h2 className="text-bottom">{this.state.tag}</h2>
                </div>
              </div>
              <p>Enter additional tags seperated by a comma</p>
              <form className="form-inline" onSubmit={this.searchMultiTag} >
                <input className="form-control mr-sm-2" onChange={this.handleInput} type="search" placeholder="tag (e.g religion, catholic)" aria-label="Search" style={{width:"90%"}}></input>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit" style={{width: "9%"}}>Search</button>
              </form>
              <ShowStories
                URL = {this.URL}
                editPath={this.state.editPath}
                stories={this.state.news}>  
              </ShowStories>
            </div>

              <TopTags 
                URL = {this.URL} 
                DBName= {this.proceduralDBName}
                getTagDashBoard={this.getTagDashBoard}>
              </TopTags>
          </div>     
        )
    }
}
              