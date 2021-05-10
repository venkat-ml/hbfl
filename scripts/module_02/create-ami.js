// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk');
const EC2 = require('aws-sdk/clients/ec2')

// TODO: Configure region
AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new EC2()

// createImage('i-0d5f0fecf82aaa60e', 'hamsterImage') //any running iamge id 
//   .then(() => console.log('Complete'))

function createImage(seedInstanceId, imageName) {
  // TODO: Implement AMI creation
  const params = {
    InstanceId: seedInstanceId,
    Name: imageName
  };

  return new Promise((resolve, reject) => {
    ec2.createImage(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

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

listInstances()
  .then(data => createImage(data[0].InstanceId, 'hamsterImage'))   //any running Instance id
  .then(() => "Complete")