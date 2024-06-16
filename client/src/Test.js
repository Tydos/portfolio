import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cards from './Cards';

function Test() {

const [val,setVal] = useState([]);

useEffect(
    () => {
        const fetchdata = async () => {
            try{
                const response = await axios.get("https://portfolio-backend-fe7srliu9-tydos-projects.vercel.app/getitems");
                setVal(response.data);
                console.log(response.data);
            }   
            catch(e)
            {
                console.error(e);
            }
        }

        fetchdata();
       
        // console.log(val[0].name);
    },[]);

  return (
    <>
        <h1>Test Site</h1>

         <div class="grid grid-cols-1 p-5 gap-5">
         {val.map((item, index) => (
        <Cards key={index} name={item.name} />
            ))}
        
        </div>   

    </>
  )
}

export default Test