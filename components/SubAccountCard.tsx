import { CharaterCard } from "./CharaterCard";

export const SubAccountCard = () => {
    return (
        <div className=" pb-10 border-b border-gray-300 last:border-0">
            <div className=" flex items-center gap-5">
                <p className=" py-5 text-lg font-bold ">账号</p>
            </div>
            <div className=" grid grid-cols-2 gap-10">
                <CharaterCard />
                <CharaterCard />
            </div>
        </div>
    )
}