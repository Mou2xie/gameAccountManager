import { Settings } from 'lucide-react';
import { CirclePlus, CircleMinus } from 'lucide-react';


export const CharaterCard = () => {
    return (
        <div className=" bg-gray-100 p-5 rounded-xl space-y-3">
            <div className=" flex justify-between">
                <p className=" font-bold">角色1</p>
                <div className=" flex gap-3 items-center">
                    <CircleMinus className=" cursor-pointer text-gray-400 w-6" />
                    <p className=" text-center">6 小时</p>
                    <CirclePlus className=" cursor-pointer text-gray-400 w-6" />
                </div>
            </div>
            <div className=" grid grid-cols-6 gap-10">
                <div className=" col-span-1 space-y-3">
                    <p className=" text-sm text-gray-500">Lv 60</p>
                    <p className=" text-sm text-gray-500">职业：战士</p>
                </div>
                <div className=" col-span-5 space-y-3">
                    <p className=" text-sm text-gray-500">物品</p>
                    <div className=" flex flex-wrap gap-2">
                        <div className="badge badge-soft badge-primary">魔泉</div>
                        <div className="badge badge-soft badge-secondary">声望</div>
                        <div className="badge badge-soft badge-accent">血瓶</div>
                        <div className="badge badge-soft badge-primary">料理</div>
                        <div className="badge badge-soft badge-primary">猫头</div>
                        <div className="badge badge-soft badge-success">打卡器</div>
                        <div className="badge ">+</div>
                    </div>
                </div>

            </div>
            <div className=" flex justify-end items-center gap-3">
                <Settings className=" cursor-pointer text-gray-400 w-8" />
            </div>

        </div>
    )
}