import React, { Component } from 'react';
import axios from 'axios';
import ShowStories from './ShowStories';

export default class VisualiseDashboard extends Component {
    
    constructor(props){
        super(props);
        this.setSimilarTags = this.setSimilarTags.bind(this);
        this.state = {
            tag: '',
            data: [],
            allTags:[]
        }
        // this.handleInput = this.handleInput.bind(this);
        this.searchTag = this.searchTag.bind(this);
    }
    componentDidMount(){

        axios.get(this.props.URL+'/categorised')
          .then(response => {
            this.setState({ 
              data: response.data
            }, () => this.getTags());
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
    searchTag(){
        console.log(this.props.URL+'/searchsimilar/'+this.props.tag)
        axios.get(this.props.URL+'/searchsimilar/'+this.props.tag).then(response => {
            this.setState({ similarTags: response.data }
          , () => this.getSimilarTags(this.props.tag));
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    getSimilarTags(searchTag){
        console.log("Whhat")
        var myTags = [];
        // eslint-disable-next-line
        this.state.data.map(function(object,i){ // eslint-disable-next-line
            if(object.tags.length !== 0){
                myTags.push(...object.tags)}
        });
        var similarTags = myTags.filter(function(element){
            if(element.includes(searchTag)) {
              return searchTag;
            }
          });
          console.log(similarTags)
        this.countTagOccurences(similarTags)
    }
    getTags(){
        var myTags = [];
        // eslint-disable-next-line
        this.state.data.map(function(object,i){ // eslint-disable-next-line
            if(object.tags.length !== 0){
                // console.log(object.tags)
                myTags.push(...object.tags)}
        });
        this.countTagOccurences(myTags)
    }
    countTagOccurences(tags) {
        // var counts = {};
        var counts = {}
        var i;
        var value;
        // tags.sort()
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
        console.log("COUNTS: "+counts['trump'])
        var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
        var tagMap = []
        keysSorted.forEach(element => {
          const topTag = { 
            text: element,
            occurences: counts[element]
          }
          tagMap.push(topTag)
        });
        // console.log("KEY SORTED: "+keysSorted)
        this.setSimilarTags(tagMap);
    }
    setSimilarTags(tags) {    
        this.setState({
            similar: tags
        })
    }
    
    getTopTags= tag =>{
        return(
                <tr>
                  <a href="" onClick={this.props.getTagDashBoard(tag.text)}>
                     <td>
                        {tag.text}
                    </td> 
                  </a>
                  <td>
                    {tag.occurences}
                  </td>
                </tr>         
        )
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
        const similarTags = this.state.data.slice(0, 20).map(this.getClickableTag)
        return (

            <div style={{width: "75%", margin:10}} className="border border-secondary border rounded bg-light">
              <h1>Dashboard for {this.props.tag} tag</h1>
              <div className="toprow d-flex justify-content-between border">

                <div className="stats d-flex align-items-start flex-column" style={{margin:15}}>
                    <h5>First occurence of tag: </h5>
                    <h5>Month with most tag cases:</h5>
                    <h5>Frequently associated tags:</h5>
                    <h5>Similar tags: {similarTags}</h5>
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
              