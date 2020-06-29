const dev_to = {
  type: "app",
  app: "dev_to",
}

const moment = require('moment')

const axios = require('axios')
module.exports = {
  name: "fresh-stories-by-tag",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    tag: {
      type: "string", 
      label: "Tag",
      description: "Tags to watch",
      optional: true,
      default: '',
    },
    dev_to,
  },
  dedupe: "greatest",
  async run(event) {
    const url = `https://dev.to/api/articles?state=fresh&per_page=1000&tag=${encodeURIComponent(this.tag)}`
    const data = (await axios({
      method: "get",
      url,
      headers: {
        "api-key": `${this.dev_to.$auth.api_key}`,
      },
    })).data

   data.forEach(event=>{
     this.$emit(event,{
       id: event.id,
       ts: moment(event.created_at).valueOf(),     
       summary: event.title,
     })
   })
  },
}
