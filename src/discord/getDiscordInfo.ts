import axios from "axios";

type Data = {
    id: string;
    username: string;
    avatar: string;
    avatarAutogenUrl: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    flagsAutogen: string[];
    banner: string;
    bannerAutogenUrl: string;
    bannerAutogenGifUrl: string;
    accent_color: number;
    global_name: string;
    avatar_decoration_data: null;
    banner_color: string;
    clan: any;
    mfa_enabled: boolean;
    locale: string;
    premium_type: number;
    email: string;
    verified: boolean;
};

const flagConverters = {
    discordEmployee: 1 << 0,
    partneredServerOwner: 1 << 1,
    hypesquadEventsMember: 1 << 2,
    bugHunterLevel1: 1 << 3,
    houseBravery: 1 << 6,
    houseBrilliance: 1 << 7,
    houseBalance: 1 << 8,
    earlySupporter: 1 << 9,
    teamPseudoUser: 1 << 10,
    bugHunterLevel2: 1 << 14,
    verifiedBot: 1 << 16,
    verifiedDeveloper: 1 << 17,
    certifiedModerator: 1 << 18,
    botHttpInteractions: 1 << 19,
    activeDeveloper: 1 << 22,
};

type Return =
    | {
          ok: false;
          error: string;
      }
    | {
          ok: true;
          data: Data;
      };

export default async function getDiscordInfo(
    access_token: string
): Promise<Return> {
    try {
        const response = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        let data = response.data;
        try {
            data = JSON.parse(response.data);
        } catch (e) {}

        //convert flags
        const flags = [];
        for (const flagName in flagConverters) {
            const flagKey =
                flagConverters[flagName as keyof typeof flagConverters];
            if ((data.flags & flagKey) == flagKey) {
                flags.push(flagName);
            }
        }

        data.flagsAutogen = flags;

        //autogen avatar and banner
        data.avatarAutogenUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        data.bannerAutogenUrl = `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png`;
        data.bannerAutogenGifUrl = `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.gif`;

        return {
            ok: true,
            data: response.data,
        };
    } catch (e: any) {
        return {
            ok: false,
            error: e.message,
        };
    }
}
