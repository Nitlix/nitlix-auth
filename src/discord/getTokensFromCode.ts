import axios from "axios";

type DiscordReturn = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    refresh_token: string;
    scopes: string[];
};

type Return =
    | {
          ok: false;
          error: string;
      }
    | {
          ok: true;
          data: DiscordReturn;
      };

export default async function getTokensFromCode(
    client_id: string,
    client_secret: string,
    code: string,
    redirectUri: string,
    scopes: string[]
): Promise<Return> {
    try {
        const params = new URLSearchParams({
            client_id,
            client_secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            scope: scopes.join(" "),
        });

        const response = await axios.post(
            "https://discord.com/api/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        let data = response.data;
        try {
            data = JSON.parse(response.data);
        } catch (e) {}

        data.scopes = data.scope.split(" ");
        delete data.scope;

        return {
            ok: true,
            data,
        };
    } catch (e: any) {
        return {
            ok: false,
            error: `Failed to get tokens from code. Status: ${
                e ? (e.response ? e.response.status : e) : "Unknown status"
            }. Error:
                ${
                    e
                        ? e.response
                            ? e.response.data.error
                            : e
                        : "Unknown error"
                }`,
        };
    }
}
