// Imports
const AWS = require('aws-sdk')
const cfParams = require('./cloudfront-parameters')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create CloudFront SDK Object
const cf = new AWS.CloudFront()

createDistribution('hamster-bucket-dplvs21')
.then(data => console.log(data))

function createDistribution (bucketName) {
  // TODO: Create params const object
  const params = {
    DistributionConfig : {
      CallerReference : '${Date.now()}',
      Comment : 'HBFL Distribution',
      DefaultCacheBehaviour : cfParams.defaultCacheBehavior(bucketName),
      Origins : cfParams.origins(bucketName),
      HttpVersion : 'http2',
      PriceClass : 'PriceClass-100',
      IsIPV6Enabled : true,
      Enabled : true
    }
  }

  return new Promise((resolve, reject) => {
    // TODO: Call createDistribution
    cf.createDistribution(params, (err, data) => {
      if (err) reject (err)
      else resolve(data)
    })
  })
}
