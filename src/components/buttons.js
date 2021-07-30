import React from 'react';
import { Line } from 'react-chartjs-2';

class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            primaryDay: String,
            primaryCount: Number,
            secondaryDay: String,
            secondaryCount: Number,
            loaded: false,
            errored: false,
            data: null,
            options: null,
            graphed: false,
        }
        this.handleClick= this.handleClick.bind(this);
      }


    async handleClick(event) {
        this.setState({current: event.target.id})
        let req = await this.load(event.target.id)
        if(!req) { return this.setState({errored: true})}
        if(req) {
          this.setState({errored: false})
          this.setState({loaded: true})
          let graph = await this.pack()
          if(graph) {
            this.setState({errored: false})
            this.setState({graphed: true})
          } else {
            this.setState({errored: true})
            this.setState({graphed: false})
          }
        }
    }
    
    render() {
      return (
        <>
        <div id="buttons" style={{width:"800px" , height:"80px"}}>
        <button type="button" id="year" onClick={this.handleClick}>Yearly</button>
        <button type="button" id="month" onClick={this.handleClick}>Monthly</button>
        <button type="button" id="week" onClick={this.handleClick}>Weekly</button>
        <button type="button" id="vc_week" onClick={this.handleClick}>VC Weekly</button>
        <button type="button" id="compare" onClick={this.handleClick}>Compare</button>
        </div>
        
        
        {this.state.graphed && 
           <Line data={this.state.data} options={this.state.options} />
        }
        <>
        {
          this.state.errored && 
          <h1>Not available yet...</h1>
        }
        </>
        
        </>
      );
    }

    async load(target) {
        if(this.props.primary && !this.props.secondary) {

          // ADD checks and return null

          let data = this.props.primary
          let arr = []

          if(!data.thankedYearly[0]) return null
          if(target==="compare") {
            this.setState({graphed: null})
            this.setState({errored: true})
            return null
          }

          // Load data as array

          let daylist = this.getDaysArray(new Date(data.thankedYearly[0].day), new Date());

          
          if(target!==`vc_week`) {
            daylist.forEach(day=>{
              if(data.thankedYearly.find(o=>new Date(o.day).toISOString().split('T')[0]===day)) {
                  if(!data.thankedYearly.find(o=>new Date(o.day).toISOString().split('T')[0]===day).count) { 
                    arr.push({day: day, count: 0})
                  } else {
                    arr.push({day: day,count: data.thankedYearly.find(o=>new Date(o.day).toISOString().split('T')[0]===day).count})
                  }
              } else {
                arr.push({day: day, count: 0})
              } 
            })
          } else {
            daylist.forEach(day=>{
              if(data.thankedWeekly.find(o=>new Date(o.day).toISOString().split('T')[0]===day)) {
                  if(!data.thankedWeekly.find(o=>new Date(o.day).toISOString().split('T')[0]===day).vc) { 
                    arr.push({day: day, count: 0})
                  } else {
                    arr.push({day: day,count: (data.thankedWeekly.find(o=>new Date(o.day).toISOString().split('T')[0]===day).vc/3600000).toFixed(2)})
                  }
              } else {
                arr.push({day: day, count: 0})
              } 
            })
          }
          
          


          if(target===`week`) arr = arr.slice(-7)
          if(target===`month`) arr = arr.slice(-31)
          if(target===`year`) arr = arr.slice(-365)
          if(target===`vc_week`) arr = arr.slice(-7)
          if(arr.length<1) return null

          this.setState({primaryDay: arr.map(e=>e.day)})
          this.setState({primaryCount: arr.map(e=>e.count)})

          return true

        }
    } 

    async pack() {
      // CHECK IF DATA IS AVAILABLE
      if(this.state.primaryDay.length<1) {
        this.setState({errored: true})
        return null
      }
      if(this.state.primaryCount.length<1) {
        this.setState({errored: true})
        return null
      }

      let data = {
        labels: this.state.primaryDay,
        datasets: [
          {
            label: 'Thanks',
            data: this.state.primaryCount,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
    
      let options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      
      this.setState({data: data})
      this.setState({options: options})

      return true

    }

    getDaysArray = function(start, end) {
      for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
          arr.push(new Date(dt).toISOString().split('T')[0]);
      }
      return arr;
  };

}
  
export default Buttons;