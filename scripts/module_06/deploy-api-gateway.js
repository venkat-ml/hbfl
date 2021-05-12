// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
const apiG = new AWS.APIGateway()
const apiId = 'hkyy7ber69'  // Api ID next to the API Name in brackets

createDeployment(apiId, 'prod')
.then(data => console.log(data))

function createDeployment (apiId, stageName) {
  // TODO: Create params const
  const params = {
    restApiId : apiId,
    stageName : stageName
  }

  return new Promise((resolve, reject) => {
    // TODO: Create deployment
    apiG.createDeployment(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
