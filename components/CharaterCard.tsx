
export const CharaterCard = () => {
    return (
        <div className=" grid grid-cols-6 gap-10 bg-gray-100 p-5 rounded-xl">
            <div className=" col-span-1 space-y-3">
                <p className=" text-lg font-medium">角色1</p>
                <p className=" text-sm text-gray-500">Lv 60</p>
                <p className=" text-sm text-gray-500">职业：战士</p>
                <p className=" text-sm text-gray-500">阶级：一转</p>
            </div>
            <div className=" col-span-5 space-y-3">
                <p className=" text-sm text-gray-500">物品 (50)</p>
                <div className=" flex flex-wrap gap-2">
                    <div className="badge badge-soft badge-primary">魔泉</div>
                    <div className="badge badge-soft badge-secondary">声望</div>
                    <div className="badge badge-soft badge-accent">血瓶</div>
                    <div className="badge badge-soft badge-primary">料理</div>
                    <div className="badge badge-soft badge-primary">猫头</div>
                    <div className="badge badge-soft badge-success">打卡器</div>
                </div>
            </div>
        </div>
    )
}