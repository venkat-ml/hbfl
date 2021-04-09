// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')
const EC2 = require('aws-sdk/clients/ec2')
const { Promise } = require('bluebird')

// TODO: Configure region
AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new EC2()

function listInstances() {
  // TODO: List instances using ec2.describeInstances()
  return new Promise((resolve, reject) => {
    ec2.describeInstances({}, (err, data) => {
      if (err) reject(err)
      else {
        resolve(data.Reservations.reduce((i, r) => {
          return i.concat(r.Instances)
        }, []))
      }
    })
  })
}

function terminateInstance(instanceId) {
  // TODO: Terminate an instance with a given instanceId
  const params = {
    InstanceIds: [
      instanceId
    ]
  }

  return new Promise((resolve, reject) => {
    ec2.terminateInstances(params, (err, data) => {
      if (err) reject(err)
      else {
        resolve(data)
      }
    })
  })

}

listInstances()
  .then(data => console.log(data))

terminateInstance('i-0fa160868442def48')
  .then(data => console.log(data))