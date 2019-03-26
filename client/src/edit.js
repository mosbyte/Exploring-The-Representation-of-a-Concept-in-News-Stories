import React, { Component } from 'react';
import axios from 'axios';
import TopTags from './components/toptags'
import TagInput from './components/TagsInput'
import AddedTags from './components/AddedTags'

export default class Edit extends Component {
  
    inputElement = React.createRef()

    constructor(props) {
        super(props);
        if(this.props.match.params.which === 'chant'){ this.URL = '/chantnews'} 
        else if(this.props.match.params.which === 'ritual'){this.URL = '/ritualnews'}
        this.setUpTags = this.setUpTags.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.setStates = this.setStates.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
          tags: [],
          currTag: {
            text: '',
            key: ''
          }
        };
      }
      componentDidMount(){
        console.log(this.props.match.params.which)
        console.log(this.props.match.params.id)
        var id =this.props.match.params.id
          axios.get(this.URL+'/edit/'+id)
          .then(response => {
            this.setState({ 
              id: response.data._id,
              title: response.data.title,
              contents: response.data.contents,
              published: response.data.published,
              source: response.data.source,
              link: response.data.link,
              prev_tags: response.data.tags
            }, this.addPrevioustags);
          })
          .catch(function (error) {
            console.log("IT NEVER RECEIVED")
            console.log(error);
          })
          document.addEventListener('keydown', this.handleKeyPress);
      }
      handleKeyPress = e => {
   
        var updateKeyNum = 85; //u
        if (e.altKey && e.keyCode === updateKeyNum) {
          this.onSubmit(e);
        }
      }
      handleInput = e => {
        var delimiters = [",", " "];
        const itemText = e.target.value.toLowerCase();
        console.log(itemText)
        const currTag = { 
          text: itemText,
          key: Date.now()
        }
        if(delimiters.includes(itemText.slice(-1))){
          this.addTag(e)
        } else{
          this.setState({
            currTag
          })
        } 
      }
    
      addTag = e => {
        e.preventDefault()
        const newTag = this.state.currTag
        if (newTag.text !== "") {
          console.log(newTag)
          const tags = [...this.state.tags, newTag]
          this.setState({
            tags: tags, 
            currTag: {
              text: "",
              key: "" 
            }
          })
          console.log(this.state.tags)
        }
        console.log(this.state.tags)
      }
      addTopTag = tag => { 
        const topTag = { 
          text: tag,
          key: Date.now()
        }
        console.log(topTag)
        const mytags = [...this.state.tags, topTag]
        this.setState({tags: mytags});
      }
      addPrevioustags = () =>{
        var xx = this.state.prev_tags;
        console.log(xx)
        var prevTags = []
        xx.forEach(element => {
          const prevTag = { 
            text: element,
            key: Date.now() + xx.indexOf(element)
          }
          prevTags.push(prevTag);
        });
        console.log(prevTags)
        this.setState({tags: prevTags},);
      }
      removeTag = key => {
        const filteredtags = this.state.tags.filter(item => {
          return item.key !== key
        })
        this.setState({
          tags: filteredtags    
        })
        console.log(this.state.tags);
      } 
      setUpTags() {
        const tags = [...this.state.tags]
        var arr_tags = tags.map(x => x.text)
        this.setState({
          valid_tags: arr_tags 
        }, () => {this.setStates('categorised')});        
      }
  
      setStates(statusOfStory) {
        var curr_date = Date.now()
        
        if(statusOfStory==="categorised"){
          var tags = this.state.valid_tags
        }
        this.setState({
          date: curr_date,
          valid_tags: tags,
          status: statusOfStory,
        }, () => {this.submitChanges()});
      }
      onSubmit(e) {
        this.setUpTags()
        e.preventDefault();
      }
      submitChanges(){
        const obj = {
          title: this.state.title,
          contents: this.state.contents,
          published: this.state.published,
          source: this.state.source,
          link: this.state.link,
          status: this.state.status,
          date_categorised: this.state.date,
          tags: this.state.valid_tags,
        };
        console.log("what has been submitted "+obj)
        // await axios.post(this.URL+'/news/add/'+this.state.category, obj).then(res => console.log(res.data));
        axios.post(this.URL+'/update/old/'+this.state.id, obj).then(res => console.log(res.data));
       
        this.props.history.push(this.URL+'/database');
      }
     
      render() {
        return (
          <div className="d-flex justify-content-between">
          <div style={{width: 750, margin:10}}className="flex-column border border-secondary border rounded bg-light">
            <h4>Top Tags</h4>
              <TopTags
                URL={this.URL}
                addTopTag={this.addTopTag}>
              </TopTags>
              <br></br>
              Tag Delimeters: Enter, Space or Comma<br></br>
              Update: alt + u <br></br><br></br>
          </div>
            <div style={{ margin: 10}} className="border border-secondary border rounded bg-gradient-secondary bg-light">
            <div className="form-inline justify-content-center bg-secondary"  style={{padding:5}}>
                {/* <label className="my-1 mr-2" for="inlineFormCustomSelectPref"></label> */}
                <TagInput           
                      addTag={this.addTag} 
                      inputElement={this.inputElement}
                      handleInput={this.handleInput}
                      currTag={this.state.currTag}
                      onChange={this.handleInput}
                    />
              </div>               
                <div style={{marginTop: 10}}>
                  
                {/* <iframe src={this.state.link} frameBorder="1" style={{wdith: 1200}}></iframe> */}
                  <h3 className="content-width">
                      <a href={this.state.link} target="_blank" rel="noopener noreferrer">{this.state.title}</a>
                  </h3>
                  <h6>{this.state.source} - {this.state.published}</h6>
                  <br></br>
                  <h5 className="content-width">"{this.state.contents}..."</h5>
                  <br></br>
              </div> 
            </div>
            <div style={{width: 750, margin:10}}className="flex-column border border-secondary border rounded bg-light">
                <h4>Added Tags</h4>
                  <button className="btn btn-outline-success btn-sm" onClick={this.onSubmit}>Update</button>          
                <AddedTags 
                  entries={this.state.tags} 
                  removeTag={this.removeTag}
                />
                </div>
          </div>       
        )
    }
}