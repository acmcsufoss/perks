# Perks

Set of commands to mint, award, and use perks.

## Development

### Setup

1. Install [Deno](https://deno.land/manual/getting_started/installation)

### Run

1. Create a `.env` file with the following content:

```env
PUBLIC_KEY=""
GUILD_ID=""
BOT_TOKEN=""
BOT_ID=""
```

2. Run the bot server:

```bash
deno run -Ar --unstable bot/http/main.ts

# Or

deno task start
```

> **Note** Copy the `https` URL and add it to the interactions endpoint URL on
> the General Information page:
> `https://discord.com/developers/applications/$BOT_ID/information`.

<a href="https://discord.com/developers/applications/">
<img width="483" alt="image" src="https://user-images.githubusercontent.com/31261035/206064674-510f41f7-06c2-4899-8ace-b9451a8b0ad8.png">
</a>

Our development invite link:

```url
https://discord.com/api/oauth2/authorize?client_id=1048046283367133246&permissions=2733747599424&scope=bot
```

### Update dependencies

1. Install the UDD tool:

```bash
deno install -rf --allow-read=. --allow-write=. --allow-net https://deno.land/x/udd/main.ts
```

2. Update dependencies:

```bash
udd */**/*.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes/)
