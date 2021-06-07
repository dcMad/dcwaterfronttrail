import { Component } from "react"

import closeIcon from './../assets/highlight_off-white.svg'
import minIcon from './../assets/highlight_off-white-min.svg'

export default class Card extends Component {

    constructor(props) {
        super(props)

        this.state = {
            cardContent: null,
            currentTab: null,
            cardHidden: false,
            searchHidden: true,
            popUpTab: false, // if true, the pop-up would be made visible
        }
    }

    selectTab(index) {
        console.log(this.props.tabs[index])
        this.setState({
            cardContent: this.props.tabs[index].content,
            currentTab: index
        })
    }

    selectTabPopUp(index) {
        this.setState({
            ...this.state,
            popUpTab: {
                content: this.props.tabs[index].content
            }
        })
    }

    toggleCard() {
        let card = true, search = this.state.searchHidden
        if ( this.state.cardHidden ) {
            card = false
            search = true
        }

        this.setState({
            ...this.state,
            cardHidden: card,
            searchHidden: search
        })
    }

    toggleSearch() {
        let card = this.state.cardHidden, search = true
        if ( this.state.searchHidden ) {
            search = false
            card = true
        }

        this.setState({
            ...this.state,
            cardHidden: card,
            searchHidden: search
        })
    }

    render() {

        let goToOptions = Object.keys(this.props.allPoints).map((index) => {

            if ( this.props.allPoints[index].title != this.props.thisPoint.title ) {
                return (
                    <option key={`option_${index}`} value={index}>{this.props.allPoints[index].title}</option>
                )
            }
        })

        let tabs = ''
        if ( this.props.tabs ) {
            tabs = Object.keys(this.props.tabs).map((index) => {
                console.log(this.props.tabs[index])
                if ( !this.props.tabs[index].isPopUp ) {
                    return (
                        <span key={`tab_${index}${Date.now()}`} className={`tab ${( index == this.state.currentTab ) ? "active" : ""}`} onClick={() => { this.selectTab(index) }}>{ this.props.tabs[index].title }</span>
                    )
                } else {
                    return (
                        <span key={`tab_${index}${Date.now()}`} className={`tab ${( index == this.state.currentTab ) ? "active" : ""}`} onClick={() => { this.selectTabPopUp(index) }}>{ this.props.tabs[index].title }</span>
                    )
                }
            })
        }
    
        return (
            <div className='mt-0'>

                <div className={`fixed left-0 top-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-50 justify-center items-center overflow-hidden transition-all flex ${this.state.popUpTab ? '' : 'hidden'}`}>
                    <div className={`bg-white p-4 m-4 rounded-xl shadow-md w-full relative text-center pb-8`}>
                        <div className={`absolute left-0 right-0 -bottom-4 flex justify-center`}>
                            <a className={`bg-red-500 p-2 rounded-xl text-white uppercase tracking-widest text-xs shadow-md font-semibold`} onClick={() => {
                                this.setState({
                                    ...this.state,
                                    popUpTab: false
                                })
                            }}>close</a>
                        </div>
                        <h2 className={`text-center mb-2`}>History</h2>
                        { this.state.popUpTab.content }
                    </div>
                </div>

                <a className={`my-2 inline-block p-2 tracking-widest uppercase rounded-lg text-sm transition-all shadow-lg bg-gray-50 text-theme-colors-purple font-medium cursor-pointer`} onClick={() => { this.toggleSearch() }}>Go To</a>

                {/* GO TO PANEL */}
                <section className={`rounded-2xl mb-3 bg-white overflow-hidden shadow-lg transition-all ${this.state.searchHidden ? 'max-h-0' : 'max-h-32'}`}>
                    <div className={`p-4 pb-2 flex items-baseline`}>
                        <label htmlFor="pointFrom" className="text-theme-colors-purple font-medium w-16">From</label>
                        <input name="pointFrom" id="pointFrom" className={`w-full bg-transparent border-none p-2 bg-white ml-3 rounded-xl text-black`} value={this.props.thisPoint.title} disabled />
                    </div>
                    <div className={`p-4 pt-2 flex items-baseline`}>
                        <label htmlFor="pointTo" className="text-theme-colors-purple font-medium w-16">To</label>
                        <select name="pointTo" id="pointTo" className={`w-full bg-transparent border-none p-2 bg-white ml-3 rounded-xl text-black focus:outline-none`} onChange={(e) => { this.props.onGoToChanged(this.props.thisPoint, this.props.allPoints[e.target.value]) }}>
                            <option value="">Select ...</option>
                            {goToOptions}
                        </select>
                    </div>
                </section>

                {/* CARD */}
                <section className={`rounded-xl mb-3 bg-white overflow-hidden shadow-lg transition-all`}>
                    <div className="card-header text-white bg-theme-colors-orange px-4 py-2 flex justify-between items-center">
                        {/* <img className="w-12" src={cardIcon} alt="Card Icon"/> */}
                        <h2 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">{this.props.title}</h2>
                        
                        <div className={'flex items-center'}>
                            <a className={`w-8 inline-block p-1.5 tracking-widest uppercase rounded-xl text-sm transition-all cursor-pointer`} onClick={() => { this.toggleCard() }}>
                                {
                                    (this.state.cardHidden) ? 
                                    <img className="w-6 transform rotate-45" src={closeIcon} alt="Close Icon"/> : 
                                    <img className="w-6" src={minIcon} alt="minimize Icon"/>
                                }
                            </a>

                            { this.props.closeAction ? (
                                <span className="w-8 inline-block p-1.5 tracking-widest uppercase text-sm transition-all cursor-pointer" onClick={() => {
                                    this.props.closeAction()
                                    this.setState({
                                        cardContent: null,
                                        currentTab: null
                                    })
                                }}>
                                    <img className="w-6" src={closeIcon} alt="Close Icon"/>
                                    {/* X */}
                                </span>
                            ) : (
                                ''
                            ) }
                        </div>
                    </div>
                    <div className={`transition-all ${(this.state.cardHidden) ? 'max-h-0' : 'max-h-60'}`}>
                        <div className="card-body bg-theme-grey-50 border-t-2 border-b-2 max-h-48 overflow-y-auto">
                            {this.state.cardContent}
                        </div>
                        <div className="card-footer bg-theme-colors-orange p-2 flex justify-evenly">
                            {tabs}
                        </div>
                    </div>
                </section>

            </div>
        )
    }
}