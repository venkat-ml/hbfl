// Imports
const { ELBv2, EC2 } = require('aws-sdk')
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create a new ELBv2 object
const elbv2 = new ELBv2()
const ec2 = new EC2()
const sgName = 'hamsterELBSG'
const tgName = 'hamsterTG'
const elbName = 'hamsterELB'
//const vpcId = '/* TODO: Add your VPC Id */'
//const subnets = [
  /* TODO: Add two subnets */
//]

function getVPCId() {

  return new Promise((resolve, reject) => {
    ec2.describeVpcs({}, (err, data) => {
      if (err) reject(err)
      else resolve(data.Vpcs[0].VpcId)
    });
  })
}

function getSubnetIds() {

  return new Promise((resolve, reject) => {
    ec2.describeSubnets({}, (err, data) => {
      if (err) reject(err)
      else {
        var subnetids = [];
        data.Subnets.filter(subnets => subnetids.push(subnets['SubnetId']))
        resolve(subnetids)
      }
    });
  })
}

var vpcId, subnets;
async function myFunction() {
  vpcId = await getVPCId()
  subnets = await getSubnetIds()
  console.log(vpcId)
  console.log(subnets)
}

myFunction()



helpers.createSecurityGroup(sgName, 80)
.then((sgId) =>
  Promise.all([
    createTargetGroup(tgName),
    createLoadBalancer(elbName, sgId)
  ])
)
.then((results) => {
  console.log(results)
  const tgArn = results[0].TargetGroups[0].TargetGroupArn
  const lbArn = results[1].LoadBalancers[0].LoadBalancerArn
  console.log('Target Group Name ARN:', tgArn)
  return createListener(tgArn, lbArn)
})
.then((data) => console.log(data))

function createLoadBalancer (lbName, sgId) {
  // TODO: Create a load balancer
  const params = {
    Name : lbName,
    Subnets : subnets,
    SecurityGroups : [
      sgId
    ]
  }

  return new Promise((resolve, reject) => {
    elbv2.createLoadBalancer(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

async function createTargetGroup (tgName) {
  const params = {
    Name: tgName,
    Port: 3000,
    Protocol: 'HTTP',
    VpcId: await getVPCId()
  }

  return new Promise((resolve, reject) => {
    elbv2.createTargetGroup(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function createListener (tgArn, lbArn) {
  const params = {
    DefaultActions: [
      {
        TargetGroupArn: tgArn,
        Type: 'forward'
      }
    ],
    LoadBalancerArn: lbArn,
    Port: 80,
    Protocol: 'HTTP'
  }

  return new Promise((resolve, reject) => {
    elbv2.createListener(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
