import SideBar from '../OtherComponent/SideBar'

const Reels = () => {

    return (
        <div className='flex w-[100%] h-[100%]'>

            <div className='w-[17%]'>
                <SideBar />
            </div>

            <div className='w-[83%] px-30 pt-10 pb-5 overflow-auto scroll-smooth'>
                Reels Page
            </div>
        </div>
    )
}

export default Reels
