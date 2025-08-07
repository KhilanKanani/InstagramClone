
const SendMessage = ({ image, text }) => {
    return (
        <div>
            <div className={`bg-purple-200 mt-1.5 px-2 overflow-auto p-1.5 rounded-l-lg rounded-br-lg lg:max-w-100 max-w-65 ml-auto ${image ? "w-50" : "w-fit"}`}>
                {image && <img src={image} onClick={() => window.open(image, "_blank")} className='border-1 border-gray-300 cursor-pointer h-fit w-fit rounded-md' alt="sent image" />}
                {text && <span className="whitespace-pre-wrap break-words">{text}</span>}
            </div>
        </div>
    )
}

export default SendMessage
