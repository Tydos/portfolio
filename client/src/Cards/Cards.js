// Card.js

import React from 'react';

const Cards = ({ name }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md transition duration-100 ease-in-out transform hover:scale-90">
      <div className="text-center">
        <h2 className="text-xl font-bold">{name}</h2>
      </div>
    </div>
  );
};

export default Cards;
