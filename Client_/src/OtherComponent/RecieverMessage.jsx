
const RecieverMessage = ({ image, text }) => {
    return (
        <div>
            <div className={`bg-gray-200 mt-1.5 px-2 overflow-auto p-1.5 rounded-lg rounded-tl-none lg:max-w-100 max-w-65 mr-auto ${image ? "w-50" : "w-fit"}`}>
                {image && <img src={image} onClick={() => window.open(image, "_blank")} className='border-1 border-gray-300 cursor-pointer h-fit w-fit rounded-md' alt="sent image" />}
                {text && <span className="leading-5 whitespace-pre-wrap break-words">{text}</span>}
            </div>
        </div>
    )
}

export default RecieverMessage
