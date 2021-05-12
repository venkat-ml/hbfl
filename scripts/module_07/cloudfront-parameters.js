function origins(bucketName) {
  return {
    // TODO: Add properties for Origins
    Quantity: 1,
    Items: [
      {
        DomainName: '${bucketName}.s3.amazonaws.com',
        Id: '${bucketName}_origin',
        S3OriginConfig: {
          OriginAccessIdentity: ''
        }
      }
    ]
  }
}
function defaultCacheBehavior(bucketName) {
  return {
    // TODO: Add properties for DefaultCacheBehavior
    ForwardedValues: {
      Cookies: {
        Forward: 'none'
      },
      QueryString: false
    },
    MinTTL: 0,
    TargetOriginId: '${bucketName}_origin',
    TrustedSigners: {
      Quantity: 0,
      Enabled: false
    },
    ViewerProtocolPolicy: 'redirect-to-https',
    AllowedMethods: {
      Quatity: 2,
      Items: [
        'GET',
        'HEAD'
      ],
      CacheMethods: {
        Quantity: 2,
        Items: [
          'GET',
          'HEAD'
        ]
      }
    }
  }
}

module.exports = {
  origins,
  defaultCacheBehavior
}
