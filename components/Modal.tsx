import { CircleX } from 'lucide-react';

export const Modal = ({ isShow, setModalShow, children }: { isShow: boolean; setModalShow: React.Dispatch<React.SetStateAction<boolean>>; children: React.ReactNode }) => {
    return (
        <>
            {
                isShow && (
                    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <div
                            className=" absolute inset-0"
                            onClick={() => setModalShow(false)}
                        />
                        <div className=" relative min-w-[320px] max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100">
                            <div className=" pt-3 pr-3 flex justify-end cursor-pointer" onClick={() => setModalShow(false)}>
                                <CircleX size={25} className=" text-gray-400" />
                            </div>
                            <div className=' px-6 pb-6'>
                                {children}
                            </div>
                        </div>
                    </div>)
            }
        </>
    );
}
