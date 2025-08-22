import Pricing from '@/components/sections/Pricing';
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'
import React from 'react'

export default function page() {
    return(
        <div>
            <Navbar />
            <Pricing />
            <Footer />
        </div>
    );
}