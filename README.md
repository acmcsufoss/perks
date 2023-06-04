# Perks

Set of commands to mint, award, and use perks.

## Development

### Setup

1. Install [Deno](https://deno.land/manual/getting_started/installation)

### Run

1. Create a `.env` file based on `.env.example`.

2. Run the bot server:

```bash
deno run -Ar --unstable main.ts

# Or

deno task start
```

> **Note** Copy the `https` URL and add it to the interactions endpoint URL on
> the General Information page:
> `https://discord.com/developers/applications/$BOT_ID/information`.

<a href="https://discord.com/developers/applications/">
<img width="483" alt="image" src="https://user-images.githubusercontent.com/31261035/206064674-510f41f7-06c2-4899-8ace-b9451a8b0ad8.png">
</a>

Development invite link: http://localhost:8080/__invite

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
