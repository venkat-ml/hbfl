// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

// Declare local variables
// TODO: Create api gateway object
const apiG = new AWS.APIGateway()
const apiName = 'hamster-api'

let apiData

createRestApi(apiName)
  .then((data) => {
    apiData = data
    return getRootResource(apiData)
  })
  .then(rootResourceId => createResource(rootResourceId, 'hbfl', apiData))
  .then(hbflResourceId => createResourceMethod(hbflResourceId, 'GET', apiData))
  .then(hbflResourceId => createMethodIntegration(hbflResourceId, 'GET', apiData))
  .then(hbflResourceId => createResource(hbflResourceId, '{proxy+}', apiData))
  .then(proxyResourceId => createResourceMethod(proxyResourceId, 'ANY', apiData, 'proxy'))
  .then(proxyResourceId => createMethodIntegration(proxyResourceId, 'ANY', apiData, 'proxy'))
  .then(data => console.log(data))

function createRestApi(apiName) {
  // TODO: Create params const
  const params = {
    name: apiName
  }

  return new Promise((resolve, reject) => {
    // TODO: Create a new rest API
    apiG.createRestApi(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function getRootResource(api) {
  // TODO: Create params const
  const params = {
    restApiId: api.id
  }

  return new Promise((resolve, reject) => {
    // TODO: Get the resources and find the resource with path '/'
    apiG.getResources(params, (err, data) => {
      if (err) reject(err)
      else {
        const rootResource = data.items.find(r => r.path === '/')
        resolve(rootResource.id)
      }
    })
  })
}

function createResource(parentResourceId, resourcePath, api) {
  // TODO: Create params const
  const params = {
    parentId: parentResourceId,
    pathPart: resourcePath,
    restApiId: api.id
  }

  return new Promise((resolve, reject) => {
    // TODO: Create the resource and return the resource id
    apiG.createResource(params, (err, data) => {
      if (err) reject(err)
      else resolve(data.id)
    })
  })
}

function createResourceMethod(resourceId, method, api, path) {
  // TODO: Create params const
  const params = {
    authorizationType: 'NONE',
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id
  }

  if (path) {
    params.requestParameters = {
      ['method.request.path.${path}']: true
    }
  }

  return new Promise((resolve, reject) => {
    // TODO: Put the method and return the resourceId argument
    apiG.putMethod(params, (err) => {
      if (err) reject(err)
      else resolve(resourceId)
    })
  })
}

function createMethodIntegration(resourceId, method, api, path) {
  // TODO: Create params const
  const params = {
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id,
    integrationHttpMethod: method,
    type: 'HTTP_PROXY',
    uri: 'http://hamsterELB-233337044.ap-southeast-2.elb.amazonaws.com'
  }

  if (path) {
    params.uri += '/{${path}}'
    params.requestParameters = {
      ['integration.request.path.${path}']: 'method.request.path.${path}'
    }
  }

  return new Promise((resolve, reject) => {
    // TODO: Put the integration and return the resourceId argument
    apiG.putIntegration(params, (err) => {
      if (err) reject(err)
      else resolve(resourceId)
    })
  })
}
