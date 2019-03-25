import React, { Component } from 'react';
import axios from 'axios'

export default class Visualise extends Component {

    constructor(props) {
        super(props);
        // if(this.props.match.params.id === 'chant'){ this.URL = 'http://csi420-01-vm.ucd.ie:4000/chantnews'; this.proceduralDBName='Chant'} 
        // else if(this.props.match.params.id === 'ritual'){this.URL = 'http://csi420-01-vm.ucd.ie:4002/ritualnews'; this.proceduralDBName='Ritual'}
       
        if(this.props.match.params.id === 'chant'){ this.URL = '/chantnews'; this.proceduralDBName = 'Chant'} 
        else if(this.props.match.params.id === 'ritual'){this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual'}
      
        
        this.setTags = this.setTags.bind(this);
        this.state = {
            data: [],
            allTags:[]
        }
      }
      componentDidMount(){

        axios.get(this.URL+'/categorised')
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
        this.setTags(tagMap);
       
    }
    setTags(tags) {    
        this.setState({
            allTags: tags
        })
    }
    getTopTags= tag =>{
      
        return(
                <tr>
                  <td>
                    {this.state.allTags.indexOf(tag)+1}
                  </td>
                  <td>
                    {tag.text}
                  </td>
                  <td>
                    {tag.occurences}
                  </td>
                </tr>         
        )
    }
    render() {
        const tags = this.state.allTags.map(this.getTopTags)
        return (
          <div>
            <div>
              <h2>
                {this.proceduralDBName}: There are {tags.length} unique tags
              </h2>
            </div>  
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tag</th>
                  <th>Number of occurences</th>
                </tr>
              </thead>
              <tbody>
                { tags }
              </tbody>
            </table> 
          </div>   
          
        )
    }
}
              