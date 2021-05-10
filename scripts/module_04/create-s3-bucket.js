// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create new s3 object
const s3 = new AWS.S3()

createBucket('hamster-bucket-dplvs21')
.then((data) => console.log(data))

function createBucket (bucketName) {
  // TODO: Define params object
  const params = {
    Bucket : bucketName,
    ACL : 'public-read'
  }

  return new Promise((resolve, reject) => {
    // TODO: Create s3 bucket
    s3.createBucket(params, (err, data) => {
      if (err) reject (err)
      else resolve(data)
    })
  })
}
