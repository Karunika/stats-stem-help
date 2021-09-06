import React from 'react';
import { NavLink } from 'react-router-dom';

const Buttons = ({ targets, url }) => {
  return (
    <>
      <div id="buttons" style={{width:`800px` , height:`80px`}}>
        {targets.map(id => (
          <button type='button' id={id} key={id}>
            <NavLink to={`${url}/${id}`} activeClassName='button-active'>
              {id.replace(/_/g, ` `)}
            </NavLink>
          </button>
        ))}
      </div>
    </>
  );
}

export default Buttons;