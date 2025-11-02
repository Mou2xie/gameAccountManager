'use client';

import { useState, useEffect } from "react";
import { SubAccountCard } from "@/components/SubAccountCard";
import { MainAccountCard } from "@/components/MainAccountCard";

type MainAccount = {
  id: number;
  account: string;
}

export default function Home() {

  const [currentMainAccount, setCurrentMainAccount] = useState<MainAccount | null>(null);

  useEffect(() => {
    console.log("当前主账号:", currentMainAccount?.account);
  }, [currentMainAccount]);

  return (
    <div className=" space-y-5">
      <MainAccountCard setCurrentMainAccount={setCurrentMainAccount} />
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
