import React from "react";
import SocialMedia from "./SocialMedia";


function Splash() {
    return(
        <>
<section id="start">
<div class="h-screen bg-cover bg-center flex flex-row items-center min-h-screen p-10" style={{ backgroundImage: `url('https://res.cloudinary.com/duws62b88/image/upload/v1752601562/20221220_174214_jgjhpp.jpg')` }} >
    <div class="grid grid-cols-2">
        <div class="flex flex-cols">
            
        </div>
    </div>
  
    <div class="w-full md:w-1/2 p-5 md:text-left">
        <div class="font-bold text-white text-6xl">Prasad Jawale</div>
        <div class="font-italic text-xl text-white "> Data Science | Photography | Websites </div> 
        <div class="py-4"> <SocialMedia /> </div>
           </div>
</div>
</section>
           </>
    )
}

export default Splash;