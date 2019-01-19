const qrTerm = require('qrcode-terminal')
const Tuling123 = require('tuling123-client')

const { 
  Wechaty, 
  Message,
} = require('wechaty')

const welcome = `
=============== Powered by Wechaty ===============
-------- https://github.com/Chatie/wechaty --------

I can talk with you using Tuling123.com
Apply your own tuling123.com API_KEY
at: http://www.tuling123.com/html/doc/api.html

__________________________________________________

Please wait... I'm trying to login in...
`

console.log(welcome)

let busyIndicator = false

/**
 *
 * Apply Your Own Tuling123 Developer API_KEY at:
 * http://www.tuling123.com
 *
 */
const TULING123_API_KEY = '5c16ad9cfcf54c24a7d04527041b79d5'
const tuling = new Tuling123(TULING123_API_KEY)

const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.on('error',   onError)

bot.start()
.catch(console.error)

function onScan (qrcode, status) {
  qrTerm.generate(qrcode, { small: true })  // show qrcode on console
}

function onLogin (user) {
  console.log(`${user} login`)
}

function onLogout (user) {
  console.log(`${user} logout`)
}

function onError (e) {
  console.error(e)
}

async function onMessage (msg) {
  // Skip message from self, or inside a room
  if ((msg.self() && msg.to().id != 'filehelper' ) || msg.from().name() === '微信团队' || msg.type() !== Message.Type.Text) return

  const filehelper = bot.Contact.load('filehelper')
  if (msg.to() === 'filehelper') {
    if (msg.text() === '#status') {
	await filehelper.say('in busy mode: ' + busyIndicator)
    } else if (/^#busy/i.test(msg.text())) {
        await filehelper.say('free mode enabled')
    }
  }
  console.log('Bot', 'talk: %s'  , msg.text())

  try {
    const {text: reply} = await tuling.ask(msg.text(), {userid: msg.from()})
    console.log('Tuling123', 'Talker reply:"%s" for "%s" ',
                          reply,
                          msg.text(),
            )
    let preReply = '机器人: ' + reply
    await msg.say(preReply)
  } catch (e) {
    console.error('Bot', 'on message tuling.ask() exception: %s' , e && e.message || e)
  }
}

