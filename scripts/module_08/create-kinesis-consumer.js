// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
const lambda = new AWS.Lambda()
const functionName = 'hamster-kinesis-stream-consumer'
const kinesisArn = 'arn:aws:kinesis:ap-southeast-2:554610361374:stream/hamster-race-results'
let roleArn

helpers.createLambdaKinesisRole()
.then((arn) => {
  roleArn = arn
  return helpers.zipLambdaFile()
})
.then((codeBuffer) => createLambda(roleArn, functionName, codeBuffer))
.then(() => createTrigger(kinesisArn, functionName))
.then(data => console.log(data))
.catch(err => console.error(err))

function createLambda (roleArn, lambdaName, zippedCode) {
  const params = {
    Code: {
      ZipFile: zippedCode
    },
    FunctionName: lambdaName,
    Handler: 'index.handler',
    Role: roleArn,
    Runtime: 'nodejs12.x',
    Description: 'A kinesis consumer for the hbfl demo project',
    MemorySize: 128,
    Publish: true,
    Timeout: 15
  }

  return new Promise((resolve, reject) => {
    lambda.createFunction(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function createTrigger (kinesisArn, lambdaName) {
  // TODO: Create params const for trigger
  const params = {
    EventSourceArn : kinesisArn,
    FunctionName : lambdaName,
    StartingPosition : 'LATEST',
    BatchSize : 100
  }

  return new Promise((resolve, reject) => {
    lambda.createEventSourceMapping(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
