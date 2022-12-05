# Perks

Set of Discord Application Commands to reward and claim coupons.

## Development

### Setup

1. Install [Deno](https://deno.land/manual/getting_started/installation)

### Run

1. Create a `.env` file with the following content:

```env
PUBLIC_KEY=""
GUILD_ID=""
BOT_TOKEN=""
DATABASE_URL=""
DATABASE_PASS=""
```

2. Run the bot server:

```bash
deno run -A bot/http/main.ts
```

### Update dependencies

1. Install the UDD tool:

```bash
deno install -rf --allow-read=. --allow-write=. --allow-net https://deno.land/x/udd/main.ts
```

2. Update dependencies:

```bash
udd **/*.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes/)
