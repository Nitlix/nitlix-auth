import getDiscordInfo from "./discord/getDiscordInfo";
import getTokensFromCode from "./discord/getTokensFromCode";

const NitlixAuth = {
    discord: {
        getTokensFromCode,
        getDiscordInfo,
    },
};

export default NitlixAuth;
