import React from "react";
import SocialMedia from "./SocialMedia";


function Splash() {
    return(
        <>
<section id="start">

<div class="flex items-center justify-center min-h-screen">
    <div class="grid grid-cols-1 justify-center">
        <div class="flex items-center justify-center m-8">
            <img src="https://media.licdn.com/dms/image/D4D03AQH8UU7LZWjuDQ/profile-displayphoto-shrink_400_400/0/1718251995961?e=1723680000&v=beta&t=5-BPkNqoMl7zxsDOlyjgD8Xq2RxYhMJ5UEmlyPvn1wg" alt="" width="250px" height="250px" class="rounded-full"></img>
        </div>
        <div class="flex flex-col text-center justify-center gap-5 py-5 m-2">
            <h1 class="text-slate-500 text-6xl">Prasad Jawale</h1>
            <h2 class="text-slate-500 text-4xl inline my-2">Graduate Student | React.JS Web Developer | Machine Learning Enthusiast</h2>
            <div class="flex flex-row mt-5">
               
            </div>
        </div>
    </div>
</div>

</section>

<section>
<div class="bg-gray-100 flex flex-row items-center min-h-screen p-10">
    <div class="grid grid-cols-2">
        <div class="flex flex-cols">
            
        </div>
    </div>
    <div class="w-full md:w-1/2 text-center md:text-justfy">
        <div class="flex items-center justify-center m-8">
            <img src="https://res.cloudinary.com/duws62b88/image/upload/v1719493167/20220815_194828_dlinmq.jpg" alt="" width="350px" height="350px" class="rounded-xl"></img>
        </div>
        <SocialMedia />
    </div>

    <div class="w-full md:w-1/2 p-2 md:text-left">
        <div class="font-bold text-2xl">Prasad Jawale</div>
        <div class="font-italic text-xl"> Data Science | Photography | Websites </div> 
        <div class="py-5 md:text-justify text-xl">I'm currently an graduate student at UW - Madison. I'm interested in building websites, machine learning models and photography. Apart from that, I have experience in building Android Java applications and working with API testing tools and NoSQL databases</div>
    </div>
</div>

</section>



           </>
    )
}

export default Splash;