import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';

import { Line } from 'react-chartjs-2';

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

const getDaysArray = (start, end) =>  {
    let arr = [];
    for(let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1))
        arr.push(new Date(dt).toISOString().split('T')[0]);
    return arr;
};

const Buttons = (props) => {

    const {targetId} = useParams();

    const [errored, setErrored] = useState(false);
    const [data, setData] = useState(null);

    const load = useCallback(() => {
        const {primary, secondary} = props;
        if(primary && !secondary) {
            // ADD checks and return null
            let arr = [];
            if(!primary.thankedYearly?.[0]) return false
            if(targetId === `compare`) {
                setData(null)
                setErrored(true);
                return false
            }
            // Load primary as array
            let daylist = getDaysArray(new Date(primary.thankedYearly[0].day), new Date());
            let h, t, key;
            
            if(targetId !== `vc_week`) {
                h = {}; t = ``;
                primary.thankedYearly.forEach(o => {
                    t = new Date(o.day).toISOString().split('T')[0];
                    if(h[t]){
                        h[t].count += o.count
                    }else{
                        h[t] = { count: o.count, day: o.day }
                    }
                })
                key = `count`;
            } else {
                h = {}; t = ``;
                primary.thankedWeekly.forEach(o => {
                    t = new Date(o.day).toISOString().split('T')[0];
                    if(h[t]){
                        h[t].vc += o.vc
                    }else{
                        h[t] = { vc: o.vc, day: o.day}
                    }
                })
                key = `vc`;
            }

            daylist.forEach(day => {
                if(h[day] && h[day][key]){
                    arr.push({
                        day: day,
                        count: key === `vc` ? (h[day][key]/3600000).toFixed(2) : h[day][key]
                    })
                }else{
                    arr.push({day: day, count: 0})
                }
            })
            
            switch(targetId){
                case `year`:
                    arr = arr.slice(-365);
                    break;
                case `week`:
                    arr = arr.slice(-7);
                    break;
                case `month`:
                    arr = arr.slice(-31);
                    break;
                case `vc_week`:
                    arr = arr.slice(-7);
                    break;
                default:
                    setErrored(true);
            }
            if(arr.length < 1){
                setErrored(true);
                return false;
            }
    
            let data = {
                labels: arr.map(e => e.day),
                datasets: [
                    {
                        label: 'Thanks',
                        data: arr.map(e => e.count),
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                ],
            };

            setData(data);

            setErrored(false);
            return true
        }
    }, [props, targetId]);

    
    useEffect(() => {
        (() => {
            let req = load();
            if(!req) setErrored(true);
        })();

    }, [targetId])

  
    return (
        <>
            {!errored && <Line data={data} options={options} />}
            <>{errored && <h1>Not available yet...</h1>}</>
        </>
    );
}


export default Buttons;