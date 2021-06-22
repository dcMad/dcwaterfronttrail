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
                if ( !this.props.tabs[index].isPopUp ) {
                    return (
                        <span key={`tab_${index}${Date.now()}`} className={`tab ${( index == this.state.currentTab ) ? "active" : ""}`} onClick={() => { this.selectTab(index) }}>{ this.props.tabs[index].title }</span>
                    )
                } else {
                    return (
                        <div key={`tab_${index}${Date.now()}`}>
                            <label htmlFor={`popup_${encodeURI(this.props.tabs[index].title)}`} key={`tab_${index}${Date.now()}`} className={`tab hover:bg-transparent hover:text-white`}>{ this.props.tabs[index].title }</label>
                            <input type="checkbox" className={`modal-toggle`} id={`popup_${encodeURI(this.props.tabs[index].title)}`} />
                            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 p-4 flex justify-items-center items-center transition-all modal cursor-auto`}>
                                <div className={`bg-white p-4 m-4 rounded-xl shadow-md w-full relative text-center pb-8 md:max-w-lg md:m-auto`}>
                                    <h2 className={`text-center mb-2`}>{ this.props.tabs[index].title }</h2>
                                    <div className={`max-h-96 overflow-auto`}>
                                        { this.props.tabs[index].content }
                                    </div>
                                    <label htmlFor={`popup_${encodeURI(this.props.tabs[index].title)}`} className={`text-theme-colors-orange uppercase mt-6 text-center tracking-widest text-sm`}>close</label>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }
    
        return (
            <div className='mt-0'>

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
                    <div className={`transition-all ${(this.state.cardHidden) ? 'max-h-0' : 'max-h-96'}`}>
                        <div className="card-body bg-theme-grey-50 border-t-2 border-b-2 max-h-48 overflow-y-auto">
                            {this.state.cardContent}
                        </div>
                        <div className={`card-footer bg-theme-colors-orange p-2 grid grid-cols-${tabs.length} justify-items-center`}>
                            {tabs}
                        </div>
                    </div>
                </section>

            </div>
        )
    }
}