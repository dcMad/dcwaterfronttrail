import { Component } from "react"

import closeIcon from './../assets/highlight_off-white.svg'
import cardIcon from './../assets/tag_faces-white-36dp.svg'

export default class Card extends Component {

    constructor(props) {
        super(props)

        this.state = {
            cardContent: null,
            currentTab: null,
            cardHidden: false,
            searchHidden: true,
        }
    }

    selectTab(index) {
        this.setState({
            cardContent: this.props.tabs[index].content,
            currentTab: index
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
                return (
                    <span key={`tab_${index}${Date.now()}`} className={`tab ${( index == this.state.currentTab ) ? "active" : ""}`} onClick={() => { this.selectTab(index) }}>{ this.props.tabs[index].title }</span>
                )
            })
        }
    
        return (
            <div className='mt-10'>
                <section className={`rounded-2xl bg-white overflow-hidden shadow-lg transition-all ${this.state.cardHidden ? 'transform scale-0 translate-y-full h-0' : ''}`}>
                    <div className="card-header bg-theme-grey-800 px-4 py-2 flex justify-between items-center">
                        <img className="w-12" src={cardIcon} alt="Card Icon"/>
                        <h2 className="text-white text-lg">{this.props.title}</h2>
                        
                    </div>
                    <div className="card-body border-t-2 border-b-2 max-h-48 overflow-y-auto">
                        {this.state.cardContent}
                    </div>
                    <div className="card-footer bg-theme-grey-800 p-4 flex justify-evenly">
                        {tabs}
                    </div>
                </section>
                <section className={`rounded-2xl p-3 bg-theme-grey-800 text-white overflow-hidden shadow-lg transition-all ${this.state.searchHidden ? 'transform scale-0 translate-y-full h-0' : ''}`}>
                    <div className={`p-2 flex items-baseline`}>
                        <label htmlFor="pointFrom" className="text-sm w-16">From</label>
                        <input name="pointFrom" id="pointFrom" className={`w-full bg-transparent border-none p-2 bg-white ml-3 rounded-xl text-black`} value={this.props.thisPoint.title} disabled />
                    </div>
                    <div className={`p-2 flex items-baseline`}>
                        <label htmlFor="pointTo" className="text-sm w-16">To</label>
                        <select name="pointTo" id="pointTo" className={`w-full bg-transparent border-none p-2 bg-white ml-3 rounded-xl text-black focus:outline-none`} onChange={(e) => { this.props.onGoToChanged(this.props.thisPoint, this.props.allPoints[e.target.value]) }}>
                            <option value="">Select ...</option>
                            {goToOptions}
                        </select>
                    </div>
                </section>
                <section className={`flex justify-between items-center`}>
                    <a className={`my-2 inline-block p-2 tracking-widest uppercase rounded-xl text-sm transition-all shadow-lg text-white ${(this.state.cardHidden) ? 'bg-theme-orange-600' : 'bg-theme-grey-800 '}`} onClick={() => { this.toggleCard() }}>{(this.state.cardHidden) ? 'Info' : 'Hide'}</a>
                    <a className={`my-2 inline-block p-2 tracking-widest uppercase rounded-xl text-sm transition-all shadow-lg bg-theme-grey-800 text-white`} onClick={() => { this.toggleSearch() }}>Go To</a>
                    { this.props.closeAction ? (
                            <span className="my-2 inline-block p-2 tracking-widest uppercase rounded-xl text-sm transition-all shadow-lg bg-theme-grey-800 text-white" onClick={() => {
                                this.props.closeAction()
                                this.setState({
                                    cardContent: null,
                                    currentTab: null
                                })
                            }}>
                                {/* <img className="w-6" src={closeIcon} alt="Close Icon"/> */}
                                Close
                            </span>
                        ) : (
                            ''
                        ) }
                </section>
            </div>
        )
    }
}