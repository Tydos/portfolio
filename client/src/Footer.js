import React from 'react'
import SocialMedia from './SocialMedia'


function Footer() {
  return (
    <>
        <footer class="bg-gray-900 w-full p-3">

        <div class="flex">
      <div class="w-1/2 p-2 ">
    <div class="flex items-center justify-start">
    <h1 class="text-gray-500">@Prasad Jawale. Based in Navi Mumbai</h1>
    </div>
  </div>
  <div class="w-1/2">
    <div class="flex items-center justify-end">
      <SocialMedia></SocialMedia>
    </div>
  </div>
</div>

      
               

                
            
        </footer>
    </>
    
  )
}

export default Footer