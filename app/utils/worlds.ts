export const Regions: () => Record<string, [string, string]> = () => {
    return {
        'NA': ["North America", "North American"],
        'EU': ["Europe", "European"],
        'JP': ["Japan", "Japanese"],
        'OCE': ["Oceania", "Oceanic"],
        'CN': ["China", "Chinese"],
    }
}

export const DataCenters: () => Record<string, Array<{ name: string }>> = () => {
    return {
        "NA": [{
            name: 'Aether',
        }, {
            name: 'Primal',
        }, {
            name: 'Crystal',
        },], 'EU': [{
            name: 'Chaos',
        }, {
            name: 'Light',
        },], 'JP': [{
            name: 'Elemental',
        }, {
            name: 'Gaia',
        }, {
            name: 'Mana',
        }, {
            name: 'Meteor',
        },], 'OCE': [{
            name: 'Materia',
        },], 'CN': [{
            name: 'LuXingNiao',
        }, {
            name: 'MoGuLi',
        }, {
            name: 'MaoXiaoPang',
        }, {
            name: 'DouDouChai',
        },]
    }
}

export const Worlds: () => Record<string, Array<{ name: string }>> = () => {
    return {
        "Aether": [{
            name: "Adamantoise",
        }, {
            name: "Cactuar",
        }, {
            name: "Faerie",
        }, {
            name: "Gilgamesh",
        }, {
            name: "Jenova",
        }, {
            name: "Midgardsormr",
        }, {
            name: "Sargatanas",
        }, {
            name: "Siren",
        },],
        "Primal": [{name: "Behemoth"}, {name: "Excalibur"}, {name: "Exodus"}, {name: "Famfrit"}, {name: "Hyperion"}, {name: "Lamia"}, {name: "Leviathan"}, {name: "Ultros"},],
        "Crystal": [{name: "Balmung"}, {name: "Brynhildr"}, {name: "Coeurl"}, {name: "Diabolos"}, {name: "Goblin"}, {name: "Malboro"}, {name: "Mateus"}, {name: "Zalera"},],
        "Chaos": [{name: "Cerberus"}, {name: "Louisoix"}, {name: "Moogle"}, {name: "Omega"}, {name: "Ragnarok"}, {name: "Spriggan"}, {name: "Phantom"}, {name: "Sagittarius"},],
        "Light": [{name: "Lich"}, {name: "Odin"}, {name: "Phoenix"}, {name: "Shiva"}, {name: "Twintania"}, {name: "Zodiark"}, {name: "Alpha"}, {name: "Raiden"},],
        "Elemental": [{name: "Aegis"}, {name: "Atomos"}, {name: "Carbuncle"}, {name: "Garuda"}, {name: "Gungnir"}, {name: "Kujata"}, {name: "Tonberry"}, {name: "Typhon"},],
        "Gaia": [{name: "Alexander"}, {name: "Bahamut"}, {name: "Durandal"}, {name: "Fenrir"}, {name: "Ifrit"}, {name: "Ridill"}, {name: "Tiamat"}, {name: "Ultima"},],
        "Mana": [{name: "Anima"}, {name: "Asura"}, {name: "Chocobo"}, {name: "Hades"}, {name: "Ixion"}, {name: "Masamune"}, {name: "Pandaemonium"}, {name: "Titan"},],
        "Meteor": [{name: "Belias"}, {name: "Mandragora"}, {name: "Ramuh"}, {name: "Shinryu"}, {name: "Unicorn"}, {name: "Valefor"}, {name: "Yojimbo"}, {name: "Zeromus"},],
        "Materia": [{name: "Bismarck"}, {name: "Ravana"}, {name: "Sephirot"}, {name: "Sophia"}, {name: "Zurvan"},],
        "LuXingNiao": [{name: "HongYuHai"}, {name: "ShenYiZhiDi"}, {name: "LaNuoXiYa"}, {name: "HuanYingQunDao"}, {name: "MengYaChi"}, {name: "YuZhouHeYin"}, {name: "WoXianXiRan"},],
        "MoGuLi": [{name: "BaiYinXiang"}, {name: "BaiJinHuanXiang"}, {name: "ShenQuanHen"}, {name: "ChaoFengTing"}, {name: "LvRenZhanQiao"}, {name: "FuXiaoZhiJian"}, {name: "Longchaoshendian"}, {name: "MengYuBaoJing"},],
        "MaoXiaoPang": [{name: "ZiShuiZhanQiao"}, {name: "YanXia"}, {name: "JingYuZhuangYuan"}, {name: "MoDuNa"}, {name: "HaiMaoChaWu"}, {name: "RouFengHaiWan"}, {name: "HuPoYuan"},],
        "DouDouChai": [{name: "ShuiJingTa"}, {name: "YinLeiHu"}, {name: "TaiYangHaiAn"}, {name: "YiXiuJiaDe"}, {name: "HongChaChuan"},]
    }


}
