import { CharaterCard } from "@/components/CharaterCard";

export default function Home() {
  return (
    <div className=" space-y-5">
      <div className=" bg-gray-100 h-20 rounded-xl"></div>
      <div>
        {
          Array.from({ length: 2 }).map((_, index) => (
            <div className=" pb-10 border-b border-gray-300 last:border-0" key={index}>
              <p className=" py-5 text-lg font-bold ">账号{index + 1}</p>
              <div className=" grid grid-cols-2 gap-10">
                <CharaterCard />
                <CharaterCard />
              </div>
            </div>
          ))
        }

      </div>


    </div>
  );
}
