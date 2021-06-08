import { Component, createRef } from "react"
import L, { LatLng, LatLngBounds } from 'leaflet'

import Card from "../components/Card"
import Map from "../components/Map"

import DCLogo from './../assets/brand/dc.png'
import TeachingCityLogo from './../assets/brand/teaching_city.png'
import AmenitiesCard from "../components/AmenitiesCard";
import Gallery from "../components/Gallery";

let marker = null
let temporaryLines = []
let icon = null

const imageFolder = require.context('./../assets/images/gallery', true)

export default class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPointOfInterestSelected: false,
            pointOfInterest: {
                title: '',
                description: '',
                hours: false,
                coordinates: {
                    lat: 0,
                    lng: 0
                },
                images: [],
                amenities: [],
                scenic: [],
                history: false
            },
            pointOfInterestMenu: false, // true = open, false = close
            mapObject: false,
            preload: false
        }

        this.cardRef = createRef()
    }

    componentDidMount() {
        marker = (type) => {
            try {
                return L.icon({
                    iconUrl: require(`./../assets/markers/${type}.svg`).default,
                    iconRetinaUrl: require(`./../assets/markers/${type}.svg`).default,
                    iconSize: [45.5, 57.6],
                    iconAnchor: [22.75, 57.6]
                })
            } catch (ex) {
                return L.icon({
                    iconUrl: require(`./../assets/markers/standard.svg`).default,
                    iconRetinaUrl: require(`./../assets/markers/standard.svg`).default,
                    iconSize: [45.5, 57.6],
                    iconAnchor: [22.75, 57.6]
                })
            }
        }

        icon = (type) => {
            try {
                return require(`./../assets/icons/${type}.svg`).default
            } catch ( ex ) {
                return require(`./../assets/icons/beach.svg`).default
            }
        }

        if ( this.props.preload ) {
            try {
                let checkMapLoaded = setInterval(() => {
                    if ( this.state.mapObject ) {
                        clearInterval(checkMapLoaded)
                        this.focusOn(this.props.points[this.props.match.params.id])
                    }
                }, 100)
            } catch ( ex ) {
                console.warn(ex)
            }
        }
    }

    focusOn(point) {

        if ( this.state.mapObject ) {
            this.state.mapObject.flyTo({
                lat: point.coordinates.lat,
                lng: point.coordinates.lng
            }, point.coordinates.zoom, {
                animate: true,
                duration: 2
            })

            this.showOnMap(point.coordinates.lat, point.coordinates.lng, point.coordinates.zoom, null, "You Are Here!")
        }

        let description = point.description

        this.setState({
            isPointOfInterestSelected: true,
            pointOfInterest: {
                title: point.title,
                description: description,
                hours: point.hours,
                coordinates: {
                    lat: point.coordinates.lat,
                    lng: point.coordinates.lng,
                },
                images: point.images,
                amenities: point.amenities,
                scenic: point.scenic,
                explore: point.explore,
                history: point.history,
                historical: point.historical
            },
            pointOfInterestMenu: false
        })

        if (this.cardRef.current) {
            this.cardRef.current.setState({
                currentTab: 0,
                cardContent: this.generateInfoTab(description, point.images)
            })
        }
    }

    togglePointOfInterestMenu() {
        this.setState({
            pointOfInterestMenu: (this.state.pointOfInterestMenu) ? false : true
        })
    }

    getMapObject(obj) {
        this.setState({
            mapObject: obj
        })
    }

    generateInfoTab(description, imageList, hours = false) {
        let images = []

        if (imageList) {
            imageList.forEach(image => {
                try {
                    let imgSrc = imageFolder(`./${image}`)
                    images.push(imgSrc.default)
                } catch (ex) {
                    // invalid image
                    console.warn(ex.message)
                }
            })
        }

        return (
            <div className="p-4">
                <h3 className="font-semibold uppercase tracking-widest">About</h3>
                <div className="flex">
                    <Gallery images={images} variant="flex" />
                </div>
                <div className={'description'} dangerouslySetInnerHTML={{
                    __html: description
                }}></div>
                { ( hours ) ? (
                    <>
                    <h3 className="font-medium uppercase tracking-widest my-2">Hours</h3>
                    {hours}
                    </>
                ) : '' }
            </div>
        )
    }

    showOnMap(lat, lng, zoom, type, text = '', small = false) {

        let myMarker = L.marker({
            lat: lat,
            lng: lng
        }, {
            icon: marker(type),
            riseOnHover: true
        })

        myMarker.bindPopup(L.popup({
            className: 'popup-theme',
            closeButton: false,
            autoClose: false,
            closeOnClick: false
        }).setContent(`<p class="uppercase font-bold my-2 tracking-wider text-center ${(small) ? 'w-36' : ''}">${text}</p>`), {offset: [0, -57.6]}).addTo(this.state.mapObject)
        myMarker.openPopup()

        this.state.mapObject.flyTo({
            lat: lat - 5,
            lng: lng
        }, zoom)
    }

    fromPointToPoint(from, to) {

        let firstMarker = L.marker({
            lat: from.coordinates.lat,
            lng: from.coordinates.lng
        }, {
            icon: marker(''),
            riseOnHover: true
        })

        firstMarker.bindPopup(L.popup({
            className: 'popup-theme',
            closeButton: false,
            autoClose: false,
            closeOnClick: false
        }).setContent(`<p class="uppercase font-bold my-2 tracking-wider">${from.title}</p>`), {offset: [0, -57.6]}).addTo(this.state.mapObject)
        firstMarker.openPopup()

        let secondMarker = L.marker({
            lat: to.coordinates.lat,
            lng: to.coordinates.lng
        }, {
            icon: marker(''),
            riseOnHover: true
        })

        secondMarker.bindPopup(L.popup({
            className: 'popup-theme',
            closeButton: false,
            autoClose: false,
            closeOnClick: false
        }).setContent(`<p class="uppercase font-bold my-2 tracking-wider">${to.title}</p>`), {offset: [0, -57.6]}).addTo(this.state.mapObject)
        
        secondMarker.openPopup()

        if ( this.state.mapObject ) {
            this.state.mapObject.flyTo({
                lat: to.coordinates.lat,
                lng: to.coordinates.lng
            }, to.coordinates.zoom)

            if ( temporaryLines.length > 0 ) {
                temporaryLines.forEach(line => {
                    line.removeFrom(this.state.mapObject)
                })
            }

            let line = L.polyline([
                [from.coordinates.lat, from.coordinates.lng],
                [to.coordinates.lat, to.coordinates.lng]
            ], {
                className: "temporary-polyline"
            }).addTo(this.state.mapObject)

            temporaryLines.push(line)
        }
    }

    clearMarkers() {
        if ( this.state.mapObject ) {
            this.state.mapObject.eachLayer(layer => {
                if (layer.options.icon ) {
                    this.state.mapObject.removeLayer(layer)
                }
            })

            if ( temporaryLines.length > 0 ) {
                temporaryLines.forEach(line => {
                    line.removeFrom(this.state.mapObject)
                })
            }
        }
    }

    getDistance(from, to) {
        let fromObj = false
        let distance = 0
        try {
            if ( this.props.distance ) {
                fromObj = this.props.distance.filter(point => point.from == from)[0].to
            }
    
            distance = fromObj.filter(point => point.poi == to)[0].distance
        } catch (ex) {
            console.error(ex)
        }

        return distance
    }

    render() {

        let pointsOfInterest = Object.keys(this.props.points).map((index) => {
            let point = this.props.points[index]

            let isActive = false


            if ( point.title == this.state.pointOfInterest.title ) {
                isActive = true
            }

            return (
                <div key={`poi_${index}`} className={`${isActive ? 'bg-theme-colors-orange text-white' : 'bg-white'} px-4 py-2 mb-4 block shadow-md rounded-xl cursor-pointer text-sm overflow-hidden overflow-ellipsis whitespace-nowrap hover:bg-theme-colors-orange hover:text-white`} onClick={() => { this.clearMarkers(); this.focusOn(point) }} >{point.title}</div>
            )
        })

        let amenities = false

        if (this.state.pointOfInterest.amenities) {
            amenities = this.state.pointOfInterest.amenities.map((amenity, index) => {
                return ( <AmenitiesCard key={`amenity_${index}`} title={amenity.title} subtitle={`${Math.round(0).toFixed(2)}km`} thumbnail={icon(amenity.type)} info={amenity.info} clicked={(arg) => {
                    this.showOnMap(amenity.coordinates.lat, amenity.coordinates.lng, amenity.coordinates.zoom, amenity.type, amenity.title)
                }} />)
            })
        }

        let explore = false

        if (this.state.pointOfInterest.explore) {
            explore = this.state.pointOfInterest.explore.map((amenity, index) => {
                return ( <AmenitiesCard key={`amenity_${index}`} title={amenity.title} subtitle={`${Math.round(0).toFixed(2)}km`} thumbnail={icon(amenity.type)} info={amenity.info} clicked={(arg) => {
                    this.showOnMap(amenity.coordinates.lat, amenity.coordinates.lng, amenity.coordinates.zoom, amenity.type, amenity.title)
                }} />)
            })
        }

        let scenic = false

        if (this.state.pointOfInterest.scenic) {
            scenic = this.state.pointOfInterest.scenic.map((amenity, index) => {
                return ( <AmenitiesCard key={`amenity_${index}`} title={amenity.title} subtitle={`${Math.round(0).toFixed(2)}km`} thumbnail={icon(amenity.type)} info={amenity.info} clicked={(arg) => {
                    this.showOnMap(amenity.coordinates.lat, amenity.coordinates.lng, amenity.coordinates.zoom, amenity.type, amenity.title)
                }} />)
            })
        }

        let history = false

        if (this.state.pointOfInterest.history) {
            history = (
                <div>
                    { this.state.pointOfInterest.history }
                </div>
            )
        }

        let tabs = []

        tabs.push({
            title: "Info",
            content: this.generateInfoTab(this.state.pointOfInterest.description, this.state.pointOfInterest.images, this.state.pointOfInterest.hours)
        })

        if (amenities) {
            tabs.push({
                title: "Amenities",
                content: (
                    <div className="flex-wrap bg-white p-5 card-wrapper">
                        { amenities }
                    </div>
                )
            })
        }

        if (explore) {
            tabs.push({
                title: "Explore",
                content: (
                    <div className="flex-wrap bg-white p-5 card-wrapper">
                        { explore }
                    </div>
                )
            })
        }

        if (scenic) {
            tabs.push({
                title: "Scenic",
                content: (
                    <div className="flex-wrap bg-white p-5 card-wrapper">
                        { scenic }
                    </div>
                )
            })
        }

        if (history) {
            tabs.push({
                title: "History",
                content: history,
                isPopUp: true
            })
        }


        return (
            <>
                {/**
                 * This is a workaround div
                 * Since craco builds trailwindCSS based on the class names used in the jsx files, it wouldn't generate certain classes that this app requires; in order to work around this issue, this div is used to force generate those classes.
                 * Any dynamically generated classes should be added to this className list.
                 */}
                <div className="hidden grid-cols-4 grid-cols-3 grid-cols-2 grid-cols-1 grid-cols-5 grid-cols-6"></div>

                <div className={`bottom-0 fixed lg:left-0 z-20 mx-auto w-full flex justify-center lg:justify-start p-4 ${this.state.isPointOfInterestSelected ? 'hidden lg:block' : ''}`}>
                    <div className="bg-white bg-opacity-75 py-2 px-4 rounded-xl shadow-md max-w-xs">
                        <div className="grid grid-cols-2 items-center">
                            <img src={TeachingCityLogo} className={'w-20 mt-2'} />
                            <img src={DCLogo} className={'w-28'} />
                        </div>
                    </div>
                </div>

                <div className="map-wrapper fixed top-0 left-0 w-full h-full m-0 p-0 z-10">
                    <Map getMapObject={(obj) => { this.getMapObject(obj) }} showOnMap={this.showOnMap} />
                </div>

                <div className={`fixed top-0 right-0 w-8/12 max-h-full p-2 z-30 md:bottom-auto md:max-w-md md:left-auto md:right-0 md:top-0 dropdown ${(this.state.pointOfInterestMenu) ? 'z-50' : ''}`}>
                    <div className="bg-white rounded-xl overflow-hidden p-0">
                        <div className="flex flex-row bg-theme-colors-orange text-white shadow-lg rounded-xl transition uppercase tracking-widest items-end">
                            <a href="#" className="block w-full p-2 text-center text-sm" onClick={() => { this.togglePointOfInterestMenu() }}>Waterfront Trail</a>
                        </div>
                        <div className="bg-gray-100 pl-0 pr-2 rounded-xl">
                            <div className={`rounded-xl transition-all overflow-x-hidden overflow-y-scroll scrollbar ${(this.state.pointOfInterestMenu) ? `pl-4 pr-2 pt-4 ${(this.state.isPointOfInterestSelected) ? 'max-h-72' : 'max-h-96' }` : 'max-h-0'}`}>
                                { pointsOfInterest }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`fixed bottom-0 left-0 w-full max-h-full p-5 pb-0 z-30 md:max-w-md md:left-auto md:right-0 md:top-auto component ${this.state.isPointOfInterestSelected ? '' : 'component-hidden'}`}>
                    <Card ref={this.cardRef} title={this.state.pointOfInterest.title} tabs={tabs} thisPoint={this.state.pointOfInterest} allPoints={this.props.points} onGoToChanged={(from, to) => {
                        if ( this.state.mapObject ) {
                            this.showOnMap(to.coordinates.lat, to.coordinates.lng, to.coordinates.zoom, null,
                                    `<span class="block">${to.title}</span>
                                    <small class="mb-3 block"><span class="bg-theme-colors-purple text-white p-1 px-1.5 rounded-xl inline-block">${Number(this.getDistance(from.title, to.title)).toFixed(1)}km</span> from ${from.title}</small>`,
                                    (to.id == 0) ? true : false
                                )
                        }
                    }} closeAction={() => {
                        this.setState({ isPointOfInterestSelected: false, pointOfInterestMenu: false })
                        this.clearMarkers()
                    }} />
                </div>
            </>
        )
    }
}