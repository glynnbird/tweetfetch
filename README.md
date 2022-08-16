# tweetfetch

Given a Twitter handle, this utility fetches the account meta data and recent tweets in a form that looks like parsed RSS.

## Installation

```sh
npm install --save tweetfetch
```

## Configuration

An environment variable `TWITTER_BEARER_TOKEN` containing a Twitter API "Bearer token" must be defined.

e.g.

```sh
export TWITTER_BEARER_TOKEN="someapitoken"
```

## Usage

```js
const tf = require('tweetfetch')
const main = async () => {
  const r = await tf.fetch('boro')
  console.log(r)
}
main()
```

The response object looks like this:

```js
{
  ok: true,
  id: '370631455',
  name: 'Middlesbrough FC',
  username: 'Boro',
  tweets: [{
      link: 'https://twitter.com/Boro/status/1559160836136046597',
      pubDate: '2022-08-15T12:51:25.000Z',
      guid: '1559160836136046597',
      isoDate: '2022-08-15T12:51:25.000Z',
      creator: '@boro',
      title: "We've sold 1,300 tickets for Wednesday's trip to @stokecity 👏",
      content: '\n' +
        'Today is the cut-off for postal orders, tickets will not be available on the night 🎟 #UTB https://t.co/dwpdm5ggbw'
    }, 
    ...
    ...
  ]
}
```

- `ok` - true if successful
- `id` - the Twitter id of the user
- `name` - the long name of the user
- `username` - the username of the user
- `tweets` - an array of recent tweets
