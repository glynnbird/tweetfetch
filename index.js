const { Client } = require('twitter-api-sdk')
const TOKEN = process.env.TWITTER_BEARER_TOKEN
if (!TOKEN) {
  throw new Error('Missing TWITTER_BEARER_TOKEN')
}
const client = new Client(TOKEN)

const findInclude = function(includes, key) {
  let retval = null
  for(let i = 0; i< includes.length; i++) {
    const v = includes[i]
    if (v.media_key === key) {
      retval = v.url
      break
    }
  }
  return retval
}

// fetch a single account's meta data and recent tweets
const fetch = async (account) => {
  const retval = {}
  account = account.replace(/^@/,'')
  try {
    const lookup = await client.users.findUserByUsername(account, {
      'user.fields': ['profile_image_url', 'description']
    })
    Object.assign(retval, lookup.data)
    const tweets = await client.tweets.usersIdTweets(retval.id, { 
      'tweet.fields': ['created_at'],
      expansions: ['attachments.media_keys'],
      'media.fields': ['preview_image_url', 'url'],
      max_results: 10
    })
    console.log(JSON.stringify(tweets, null, '  '))
    retval.tweets = tweets.data.map((t) => {
      const url = `https://twitter.com/${retval.username}/status/${t.id}`
      t.link = url
      t.pubDate = t.created_at
      delete t.created_at
      t.guid = t.id
      delete t.id
      t.isoDate = t.pubDate
      t.creator = `@${account}`
      const lines = t.text.split('\n')
      if (lines.length > 1) {
        t.title = lines[0]
        lines.shift()
        t.content = lines.join('\n')
      } else {
        t.title = t.text
        t.content = ''
      }
      delete t.text
      if (t.attachments && t.attachments.media_keys) {
        const v = findInclude(tweets.includes.media, t.attachments.media_keys[0])
        if (v) {
          t.media = v
        }
      }
      return t
    })
    retval.ok = true
    return retval
  } catch (e) {
    console.error(e)
    return { ok: false }
  }
}

module.exports = {
  fetch
}
