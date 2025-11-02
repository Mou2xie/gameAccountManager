'use client';

import { SubAccountCard } from "@/components/SubAccountCard";
import { SquarePen, Trash2, SquarePlus } from 'lucide-react';

export default function Home() {

  return (
    <div className=" space-y-5">
      <div className=" flex justify-between items-center h-20 bg-gray-100 rounded-xl px-10">
        <div className=" flex items-center gap-3">
          <p className=" text-gray-500">当前账号:</p>
          <select defaultValue="选择主账号" className="select w-50" onChange={(e) => { console.log(e.target.value) }}>
            <option disabled={true}>选择主账号</option>
            <option value={1}>Crimson</option>
            <option value={2}>Amber</option>
            <option value={3}>Velvet</option>
          </select>
        </div>
        <div className=" flex items-center gap-8">
          <div className=" flex items-center gap-1 cursor-pointer">
            <SquarePlus size={20} className=" text-gray-400" />
            <span className=" text-gray-400">添加子账号</span>
          </div>
          <div className=" flex items-center gap-1 cursor-pointer">
            <SquarePen size={20} className=" text-gray-400" />
            <span className=" text-gray-400">编辑</span>
          </div>
          <div className=" flex items-center gap-1 cursor-pointer">
            <Trash2 size={20} className=" text-gray-400" />
            <span className=" text-gray-400">删除</span>
          </div>
        </div>
      </div>
      <div>
        {
          Array.from({ length: 2 }).map((_, index) => (
            <SubAccountCard key={index} />
          ))
        }
      </div>
    </div>
  );
}
