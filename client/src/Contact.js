import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import SocialMedia from './SocialMedia'

function Contact() {
  return (
    <>
    <Navbar/>
    <div class="min-h-screen">
    <h2 class="text-4xl text-gray-400 font-bold justify-center text-center my-10">Contact Details</h2>
    
    <div class="w-3/4 mx-auto bg-gray-100 p-5 rounded-xl shadow-lg mt-10">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Contact Me</h2>
    <form action="#" method="POST" class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></input>
        </div>
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></input>
        </div>
        <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" name="message" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
        </div>
        <div class="text-right">
            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
        </div>
    </form>
</div>

</div>

    <Footer/>
    </>
  )
}

export default Contact