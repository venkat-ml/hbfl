// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create kinesis object
const kinesis = new AWS.Kinesis()
const streamName = 'hamster-race-results'

createKinesisStream(streamName)
.then(data => console.log(data))

function createKinesisStream (streamName) {
  // TODO: Create params const
  const params = {
    ShardCount : 1,
    StreamName : streamName
  }

  return new Promise((resolve, reject) => {
    // TODO: Create kinesis stream
    kinesis.createStream(params, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
