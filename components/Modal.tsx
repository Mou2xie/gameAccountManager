import { CircleX } from 'lucide-react';

export const Modal = ({ isShow, setModalShow, children }: { isShow: boolean; setModalShow: React.Dispatch<React.SetStateAction<boolean>>; children: React.ReactNode }) => {
    return (
        <>
            {
                isShow && (
                    <div className=" absolute inset-0 flex justify-center items-center">
                        <div className=" absolute inset-0 bg-black opacity-10" onClick={() => setModalShow(false)}></div>
                        <div className=" min-h-[150px] w-[500px] bg-white z-10 rounded-xl shadow">
                            <div className=" pt-3 pr-3 flex justify-end cursor-pointer" onClick={() => setModalShow(false)}>
                                <CircleX size={25} className=" text-gray-400" />
                            </div>
                            <div className=' px-5 pb-5'>
                                {children}
                            </div>
                        </div>
                    </div>)
            }
        </>
    );
}