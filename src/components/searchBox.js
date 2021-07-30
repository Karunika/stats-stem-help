import React from 'react';
import Button from './buttons'
let axios = require(`axios`)

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            clicked: false,
            primary: null,
            secondary: null,
            dispose: false,
            errored: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handlePress = this.handlePress.bind(this);
      }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handlePress(event) {
        if(event.type===`click`) {
            if(this.state.clicked) {
                this.setState({dispose: true})
            } else {
                this.setState({dispose: false})
            }
        }
        
    }

    async getData(id) {
        let axious = await axios(`http://localhost:3000/api/${id}`)
        if(axious && axious.data) {
            return axious.data
        } else {
            return null
        }
    }

    async handleClick(event) {
        if(event.key===`Enter`) {
            if(event.target.id===`primary`) {
                let data = await this.getData(event.target.value)
                if(data) {
                    this.setState({clicked: true})
                    this.setState({errored: false})
                    this.setState({primary: data})
                } else {
                    this.setState({errored: true})
                }
            }

            if(event.target.id===`secondary`) {
                let data = await this.getData(event.target.value)
                if(data) {
                    this.setState({clicked: true})
                    this.setState({errored: false})
                    this.setState({secondary: data})
                } else {
                    this.setState({errored: true})
                }
            }
        }
    }
    
    render() {
        
      return (
          <>
              <input 
                value={this.state.value} 
                placeholder={this.props.placeholder} 
                id={this.props.id} 
                onChange={this.handleChange} 
                onKeyDown={this.handleClick}
                onClick={this.handlePress}
            />
            {
            this.state.clicked &&
                <Button primary={this.state.primary} secondary={this.state.secondary}/>
            }
            {
                this.state.dispose && 
                        window.location.reload()
            }
            {
                this.state.errored && 
                        <h1>User not found...</h1>
            }

          </>
            
            
      );
    }
}
  
export default SearchBox;