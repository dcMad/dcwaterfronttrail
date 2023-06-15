import HTMLReactParser from "html-react-parser"

const AmenitiesCard = (props) => {

    let tabInfo = ( props.info ) ? 
        (
            <div>
                <label htmlFor={`modal_${encodeURI(props.title)}`} className={'text-theme-colors-orange transition rounded-xl hover:bg-theme-colors-orange hover:text-white p-2 tracking-widest text-sm uppercase'}>info</label>
                <input type="checkbox" className={'modal-toggle'} id={`modal_${encodeURI(props.title)}`}/>
                <div className={'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 p-4 flex justify-items-center items-center transition-all modal cursor-auto'}>
                    <div className={'bg-white p-4 shadow-md flex flex-col rounded-xl max-w-xl m-auto'}>
                        <h2 className={'block text-center mb-3'}>{props.title}</h2>
                        <div className={'text-center'}>{HTMLReactParser(props.info)}</div>
                        <label htmlFor={`modal_${encodeURI(props.title)}`} className={'text-theme-colors-orange uppercase mt-6 text-center tracking-widest text-sm'}>close</label>
                    </div>
                </div>
            </div>
        ) : ""

    return (
        <div className="w-full px-2">
            <div className="flex items-center w-full shadow-lg overflow-hidden rounded-lg py-3 px-6 mb-4 bg-gray-100 transition cursor-pointer hover:bg-gray-200">
                <div className="card-thumbnail w-12 mr-3 bg-no-repeat bg-cover" style={{backgroundImage: `url(${props.thumbnail})`}}></div>
                <div className="card-info w-11/12" onClick={props.clicked.bind('msg')}>
                    <h3 className="tracking-wide font-medium">{props.title}</h3>
                </div>
                { tabInfo }
                <div></div>
            </div>
        </div>
    )
}

export default AmenitiesCard