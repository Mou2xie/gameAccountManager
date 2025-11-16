'use client';

import { useEffect } from "react";

const welcomeParagraphs = [
    "你好，老朋友。",
    "当法兰城的音乐再次响起，你是否也和我们一样，心头会泛起熟悉的温暖？那些在魔力世界里结识的朋友、养大的宠物、完成的任务，早已不仅是游戏数据，而是我们共同珍藏的回忆。",
    "我们是两位普通的互联网人，也是和你们一样的魔力玩家。在每天与代码打交道的日子里，我们总想着：能不能用我们最熟悉的方式，为这个带给我们无数感动的游戏做点什么呢？",
    "这个小小的愿望，最终变成了你眼前这个简单的小工具。",
    "它的诞生再简单不过——我们在游戏里发现，随着玩的深入，大家的账号越来越多，角色信息越来越杂。有时翻遍笔记也想不起来，哪个账号存着心爱的僵尸，哪个角色还留着当年打UD的回忆。用文本文档？记在手机备忘录？总觉得少了点什么。",
    "于是，在忙碌的工作之余，我们挤出时间，一行行代码敲出了这个完全免费的小工具。没有复杂的商业模式，不追求华丽的界面，只想用最朴实的方式，解决我们自己在玩游戏时遇到的困扰。",
    "我们深知账号安全的重要性——",
    "这其实只是两位魔力玩家的心意分享。在这个什么都讲究效率的时代，我们选择用这种最笨拙的方式，守护属于我们共同的魔力记忆。",
    "真诚地邀请你试试这个工具，希望它能让你在魔力世界里的旅程更加轻松愉快。或许某天在法兰城的街头，我们的角色会擦肩而过——那时，我们会在心里默默道一声：“加油，老朋友。”",
];

export default function AboutContent() {
    useEffect(() => {
        document.body.classList.add("home-background");
        return () => document.body.classList.remove("home-background");
    }, []);

    return (
        <div className="space-y-6">
            <article className="relative app-card space-y-5 text-base leading-relaxed text-[var(--color-text)] bg-[rgba(248,244,235,0.82)]">
                <p className=" text-lg font-semibold text-[var(--color-primary)]">
                    {welcomeParagraphs[0]}
                </p>
                <p>{welcomeParagraphs[1]}</p>
                <p>{welcomeParagraphs[2]}</p>
                <p>{welcomeParagraphs[3]}</p>
                <p>{welcomeParagraphs[4]}</p>
                <p>{welcomeParagraphs[5]}</p>
                <p>
                    {welcomeParagraphs[6]}
                    <strong className=" text-app-primary">
                        请放心，这个工具的所有数据都只保存在你的电脑上，我们没有任何服务器来存储你的信息。
                    </strong>
                    它不会要求你输入密码，不会连接网络，更没有任何木马或后门。它就像你书桌抽屉里那个带锁的笔记本，只有你自己能打开。
                </p>
                <p>{welcomeParagraphs[7]}</p>
                <p>{welcomeParagraphs[8]}</p>
                <div className=" border-t border-dashed border-[var(--color-border-strong)] pt-4 text-sm text-[var(--color-text-muted)]">
                    *献给我们永远的法兰城。*
                </div>
            </article>
        </div>
    );
}
