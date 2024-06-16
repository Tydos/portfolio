import React from "react";
import Navbar from "./Navbar";
import SocialMedia from "./SocialMedia";


function Splash() {
    return(
        <>
<div class="flex items-center justify-center min-h-screen">
    <div class="p-10">
        <div class="grid grid-cols-3 justify-center">
           
            <div class="col-span-2 flex flex-col justify-center p-2 m-2">
                <h1 class="text-8xl text-gray-500 bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">Prasad Jawale</h1>
                <h2 class="text-3xl text-gray-500 inline my-2">Data Science | Photography | Websites</h2>
             <div class="flex flex row mt-5">
              <SocialMedia/>
              </div>
            </div>

            <div class="col-span-1 flex items-center justify-center m-8">
                <img src="https://media.licdn.com/dms/image/D4D03AQH8UU7LZWjuDQ/profile-displayphoto-shrink_400_400/0/1718251995961?e=1723680000&v=beta&t=5-BPkNqoMl7zxsDOlyjgD8Xq2RxYhMJ5UEmlyPvn1wg" alt="" width='400px' height='400px' class="rounded-full border-2 border-gray-500"></img>
            </div>
        </div>


           
    </div>
</div>   


<div class="flex flex-row items-center justify-center min-h-screen gap-10 mx-10">

        <div class="flex-auto p-5 text-5xl">
            <h1>
            Hello! I'm Prasad, a developer skilled in Machine learning, and React. I enjoy combining technology with creativity, 
            drawing from my interests in photography and design to build engaging web applications and solving problems.
              </h1>
        </div>

        <div class="flex flex-col rounded p-5">
        </div>
           
</div>

<div class="items-start min-h-screen mx-10">

        <div class="p-5 text-5xl">
        <h1>Tech Stack</h1>
        </div>
            
        <div class="grid grid-flow-row-dense grid-cols-4 p-5 gap-5 text-xl">
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Tensorflow</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Keras</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Scikit-Learn</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>React</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Python</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Javascript</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Android SDK</h1></div> 
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>C++</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>Postman API</h1></div>
            <div class="bg-blue-100 p-10 hover:bg-blue-200 rounded-xl">  <h1>AWS EC2</h1></div>
    </div>

    
</div>

           </>
    )
}

export default Splash;