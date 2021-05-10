// Imports
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const { ELBv2, EC2 } = require('aws-sdk')

const elbv2 = new ELBv2()
const ec2 = new EC2()


// Declare local variables
const autoScaling = new AWS.AutoScaling()
const asgName = 'hamsterASG'
const lcName = 'hamsterLC'
const policyName = 'hamsterPolicy'
//const tgArn = '/* TODO: get target group ARN */'

elbv2.describeLoadBalancers({}, (err, data) => {
  err ? console.log(err, err.stack) : console.log(data.LoadBalancers[0].LoadBalancerArn);
});

function getTargetgroupArn() {

  return new Promise((resolve, reject) => {
    elbv2.describeTargetGroups({}, (err, data) => {
      var targetGroupArns = [];
      if (err) reject(err) 
      else {
        targetGroupArns.push(data.TargetGroups[0].TargetGroupArn)
        resolve(targetGroupArns);
      }
    });
  })
}

createAutoScalingGroup(asgName, lcName)
  .then(() => createASGPolicy(asgName, policyName))
  .then((data) => console.log(data))

async function createAutoScalingGroup(asgName, lcName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: [
      'ap-southeast-2a',
      'ap-southeast-2b'
    ],
    TargetGroupARNs: await getTargetgroupArn(),
    LaunchConfigurationName: lcName,
    MaxSize: 2,
    MinSize: 1
  }
  return new Promise((resolve, reject) => {
    autoScaling.createAutoScalingGroup(params, (err, data) => {
      err ? reject(err) : resolve(data)
    });
  });
}

function createASGPolicy(asgName, policyName) {
  const params = {
    AdjustmentType : 'ChangeInCapacity',
    AutoScalingGroupName : asgName,
    PolicyName : policyName,
    PolicyType : 'TargetTrackingScaling',
    TargetTrackingConfiguration : {
      TargetValue : 5,
      PredefinedMetricSpecification : {
        PredefinedMetricType : 'ASGAverageCPUUtilization'
      }
    }
  }
  return new Promise((resolve, reject) => {
    autoScaling.putScalingPolicy(params, (err, data) => {
      err ? reject(err) : resolve(data)
    });
  })
}
