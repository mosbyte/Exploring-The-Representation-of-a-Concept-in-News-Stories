import React, { Component } from 'react';
import axios from 'axios';
import ShowStories from './ShowStories';

export default class VisualiseDashboard extends Component {
    
    constructor(props){
        super(props);
        // this.setSimilarTags = this.setSimilarTags.bind(this);
        this.state = {
          news: [],
          freqAssTags: [],
          similarTags:[],
          tag: ''
        }
        // this.handleInput = this.handleInput.bind(this);
        // this.searchTag = this.searchTag.bind(this);
    }
    
    getSimilarTags(searchTag){
      console.log("Whhat")
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
    getClickableTag = tag =>{
        return(
            <div>
                <button className="btn" onClick={() => this.props.getTagDashBoard(tag)}>{tag}</button>
            </div>
        )
    }
    render() {
        // this.searchTag()
        // const similarTags = this.state.data.slice(0, 20).map(this.getClickableTag)
        this.getFrequentlyAssociated();
        // this.getSimilarTags(this.props.tag);
        var similarTags = this.state.similarTags.toString();
        var freqAssTags = this.state.freqAssTags.toString();
        return (

            <div style={{width: "75%", margin:10}} className="borders">
            <h1>{this.proceduralDBName} Visualise Dashboard</h1>
              <div className="toprow d-flex border" style={{position:'relative'}}><br></br>
                <div className="stats d-flex align-items-start flex-column" style={{width: "75%",margin:15}}>
                    <p><b>First occurence of tag: </b></p>
                    <p><b>Month with most tag cases:</b></p>
                    <p><b>Frequently associated tags:</b> {freqAssTags}</p>
                    <p><b>Similar tags: </b>{similarTags}</p>
                    <br></br>
                </div>
                <div style={{position:'absolute', bottom: 5, right: 10}}>
                  <h2 className="text-bottom">{this.props.tag}</h2>
                </div>
              </div>

              <ShowStories
                URL = {this.props.URL}
                editPath={this.props.editPath}
                stories={this.props.stories}>  
              </ShowStories>
            </div>
          
        )
    }
}
              