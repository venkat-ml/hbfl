const AWS = require('aws-sdk')
const EC2 = require('aws-sdk/clients/ec2')
const helpers = require('./helpers')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create an autoscaling object

const autoScaling = new AWS.AutoScaling()
const ec2 = new EC2()

const lcName = 'hamsterLC'
const roleName = 'hamsterLCRole'
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

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

function getProfileArn(roleName) {

  const iam = new AWS.IAM()
  const profileName = `${roleName}_profile`

  var params = {
    InstanceProfileName: profileName
  };

  return new Promise((resolve, reject) => {
    iam.getInstanceProfile(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else resolve(data.InstanceProfile.Arn)
    })
  })
}

function createLaunchConfiguration(imageId, lcName, profileArn) {
  // TODO: Create a launch configuration
  const params = {
    IamInstanceProfile: profileArn,
    //ImageId: 'ami-0d946eb4795686123',
    ImageId: imageId,
    InstanceType: 't2.micro',
    LaunchConfigurationName: lcName,
    KeyName: keyName,
    SecurityGroups: [
      sgName
    ],
    UserData: 'IyEvYmluL2Jhc2gNCnN1ZG8gYXB0LWdldCB1cGRhdGUNCnN1ZG8gYXB0LWdldCAteSBpbnN0YWxsIGdpdA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsDQpjaG93biAtUiBiaXRuYW1pOiAvaG9tZS9iaXRuYW1pL2hiZmwNCmNkIC9ob21lL2JpdG5hbWkvaGJmbA0Kc3VkbyBucG0gaQ0Kc3VkbyBucG0gcnVuIHN0YXJ0'
  }

  return new Promise((resolve, reject) => {
    autoScaling.createLaunchConfiguration(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

}

async function myFunction() {
  var profileArn = await getProfileArn(roleName)
  var imageId = await listInstances().then(data => data[0].ImageId)
  console.log(imageId)
  console.log(profileArn)
  createLaunchConfiguration(imageId, lcName, profileArn).then(data => console.log(data))

}

myFunction()