// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')
const EC2 = require('aws-sdk/clients/ec2')
const helpers = require('./helpers')

// TODO: Configure region
AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new EC2()
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
createSecurityGroup(sgName)
  .then(() => {
    return createKeyPair(keyName)
  })
  .then(() => {
    return createInstance(sgName, keyName)
  })
  .then((data) => {
    console.log('Created instance with:', data)
  })
  .catch((err) => {
    console.error('Failed to create instance with:', err)
  })

// Create functions

function createSecurityGroup(sgName) {
  // TODO: Implement sg creation & setting SSH rule
  const params = {
    Description: sgName,
    GroupName: sgName
  };

  return new Promise((resolve, reject) => {
    ec2.createSecurityGroup(params, (err, data) => {
      if (err)
        reject(err);
      else {
        let params = {
          GroupId: data.GroupId,
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 22,
              ToPort: 22,
              IpRanges: [
                {
                  CidrIp: '0.0.0.0/0'
                }
              ]
            },
            {
              IpProtocol: 'tcp',
              FromPort: 3000,
              ToPort: 3000,
              IpRanges: [
                {
                  CidrIp: '0.0.0.0/0'
                }
              ]
            }
          ]
        };
        ec2.authorizeSecurityGroupIngress(params, (err) => {
          if (err)
            reject(err);
          else
            resolve();
        });
      }
    })
  })
}

function createKeyPair(keyName) {
  // TODO: Create keypair
  const params = {
    KeyName: keyName
  }
  return new Promise((resolve, reject) => {
    ec2.createKeyPair(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function createInstance(sgName) {
  // TODO: create ec2 instance
  const params = {
    ImageId: 'ami-06202e06492f46177',
    InstanceType: 't2.micro',
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [
      sgName
    ],
    UserData: 'IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xMi54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQNCmNkIGhiZmwNCm5wbSBpDQpucG0gcnVuIHN0YXJ0'
  }

  return new Promise((resolve, reject) => {
    ec2.runInstances(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}