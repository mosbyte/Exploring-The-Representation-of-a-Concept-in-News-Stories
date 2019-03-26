import React, { Component } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import TopTags from './components/VisualiseTopTags'
import ShowStories from './components/ShowStories'
import DashBoard from './components/VisualiseDashboard'

export default class Visualise extends Component {

    constructor(props) {
        super(props);
        // if(this.props.match.params.id === 'chant'){ this.URL = 'http://csi420-01-vm.ucd.ie:4000/chantnews'; this.proceduralDBName='Chant'} 
        // else if(this.props.match.params.id === 'ritual'){this.URL = 'http://csi420-01-vm.ucd.ie:4002/ritualnews'; this.proceduralDBName='Ritual'}

        if(this.props.match.params.id === 'chant'){ this.URL = '/chantnews'; this.proceduralDBName = 'Chant'} 
        else if(this.props.match.params.id === 'ritual'){this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual'}
        
        // this.setTags = this.setTags.bind(this);
        this.state = {

            editPath: "/"+this.props.match.params.id+"/edit",
            news: [],
            freqAssTags: [],
            similarTags:[],
            tag: ''
        }
      }
    componentDidMount(){
      console.log("HOPHHP = "+this.URL)
      axios.get(this.URL+'/search/'+this.state.tag)
        .then(response => {
          this.setState({ news: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
      // axios.get(this.URL+'/searchsimilar/'+this.state.tag).then(response => {
      //     this.setState({ similarTags: response.data }
      //   , () => this.getSimilarTags(this.state.tag));
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.location !== this.props.location){
        window.location.reload();
      }
    }
    getSimilarTags(searchTag){
      console.log("Whhat")
      var myTags = [];
      // eslint-disable-next-line
      this.state.similarTags.map(function(object,i){ // eslint-disable-next-line
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
      this.state.news.map(function(object,i){ // eslint-disable-next-line
          if(object.tags.length !== 0){
              // console.log(object.tags)
              myTags.push(...object.tags)}
      });
      // this.countTagOccurences(myTags)
      return myTags
    }
    getFrequentlyAssociated(){
      var tags = this.getTags();
      var toptags = this.countTagOccurences(tags).slice(1,6)
      console.log(toptags)
      // toptags = toptags.slice(0, 5).map(this.getClickableTag)
      this.setState({freqAssTags: toptags})
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
        var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
        return keysSorted
      
    }
    setTags(tags) {    
        this.setState({
            similarTags: tags
        }, console.log("TAGS"+ this.state.similarTags))
    }
    
    getTagDashBoard = searchTag =>{
      console.log(searchTag)
      axios.get(this.URL+'/search/'+searchTag)
        .then(response => {
          this.setState({ news: response.data, tag: searchTag }
          , () => this.getFrequentlyAssociated());
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
        return (  
          <div className="d-flex justify-content-between">
            <div style={{width: "75%", margin:10}} className="border border-secondary border rounded bg-light">
              <h1>Dashboard: {this.state.tag}</h1>
              <div className="toprow d-flex border"><br></br>
                <div className="stats d-flex align-items-start flex-column" style={{margin:15}}>
                    <p><b>First occurence of tag: </b></p>
                    <p><b>Month with most tag cases:</b></p>
                    <p><b>Frequently associated tags:</b> {freqAssTags}</p>
                    <p><b>Similar tags: </b>{similarTags}</p>
                </div>
              </div>

              <ShowStories
                URL = {this.URL}
                editPath={this.editPath}
                stories={this.state.news}>  
              </ShowStories>
            </div>
              {/* <DashBoard 
                URL = {this.URL+'/search/'+this.state.tag}
                stories = {this.state.news}
                tag = {this.state.tag}
                DBName = {this.proceduralDBName}
                getTagDashBoard={this.getTagDashBoard}
                editPath = {this.state.editPath}>
              </DashBoard> */}

              <TopTags 
                URL = {this.URL} 
                DBName= {this.proceduralDBName}
                getTagDashBoard={this.getTagDashBoard}>
              </TopTags>
          </div>     
        )
    }
}
              