import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import DCLogo from './../assets/brand/dc.png'
import OshawaLogo from './../assets/brand/oshawa.png'
import TeachingCityLogo from './../assets/brand/teaching_city.png'
import WaterfrontLogo from './../assets/brand/waterfront.png'
import loadinganimation from './../assets/images/loading-animation.gif'


const LoadingScreen = () => {

    const teachingCityLogoRef = useRef()
    const oshawaLogoRef = useRef()

    const timelineObj = gsap.timeline({ paused: true })

    useEffect(() => {

        timelineObj.to("#page0", { 
            delay:1, 
            opacity: 1
        }, 0);

        timelineObj.to("#page0", { 
            opacity: 0,
            autoAlpha: 0,
            delay: 1,
            display: "none"
        }, 1);

        timelineObj.to("#page1", { 
            opacity: 1
        }, 3);

        timelineObj.from("#page1 .logo", { 
            opacity: 0,
            y: 100,
            stagger:0.2
        }, 3);

        timelineObj.to("#page1 .logo", { 
            opacity: 1,
            y:0 
        }, 4);

        timelineObj.from("#page1 .text *", {
            opacity: 0,
            delay: 0.5,
            y: 100,
            stagger:0.2,
        }, 3 );

        timelineObj.to("#page1 .text *", {
            opacity: 1,
            y: 0,
        }, 4);

        timelineObj.to("#page1", {delay:1,
            opacity: 0,
            autoAlpha: 0,
            display: "none"
        }, 5);

        timelineObj.to("#page2", {delay:1,
            opacity: 1,
        }, 6);

        timelineObj.to("#page2", {
            opacity: 0,
            autoAlpha: 0,
            delay: 2,
            display: "none",
        }, 7);

        timelineObj.from("#splash", {
            opacity: 1,
            autoAlpha: 1
        }, 8);

        timelineObj.to("#splash", {
            opacity: 0,
            autoAlpha: 0
        }, 9);

        timelineObj.duration(7)

        timelineObj.play()
    })

    return (<main id="splash">
    <section id="page0" className="page max-w-lg text-center">
        <img
            className="logo"
            id="teaching"
            src={TeachingCityLogo}
            alt="Teaching City Logo"
        />
        <div className="logo-2">
            <img
                className="logo"
                id="oshawa_logo"
                src={OshawaLogo}
                alt="Downtown Oshawa"
            />
            <img
                className="logo"
                id="durham_logo"
                src={DCLogo}
                alt="Durham College Logo"
            />
        </div>
    </section>
    <section id="page1" className="page max-w-lg text-center">
        <img
            className="logo"
            id="waterfront_logo"
            src={WaterfrontLogo}
            alt="Waterfront Logo"
        />
        <div className="text">
            <h2>DISCOVER THE</h2>
            <h1>OSHAWA</h1>
            <h3>WATERFRONT TRAIL</h3>
        </div>
    </section>
    <section id="page2" className="page max-w-lg text-center">
        <img
            className="logo"
            id="loading"
            src={loadinganimation}
            alt="Teaching City Logo"
        />
    </section>
</main>
    )
}

export default LoadingScreen