function makeUpdateInfo (orig, dest) {
  let result = {}
  Object.keys(orig).forEach(key => {
    if (dest.hasOwnProperty(key)) {
      let origValue = orig[key]
      let destValue = dest[key]
      if (Array.isArray(origValue) && Array.isArray(destValue)) {
        let origStr = origValue.toString()
        let destStr = destValue.toString()
        if (origStr !== destStr) {
          result[key] = destValue
        }
      } else {
        if (orig[key] != dest[key]) {
          result[key] = dest[key]
        }
      }
    }
  })
  return result
}

let fieldMap = {
  kDistributioneBaseCommonUrl: '接口地址',
  kJPushAppKeyString: '极光 Key',
  kJPushChannelID: '极光Channel',
  Tag: 'Tag',
  PRODUCT_BUNDLE_IDENTIFIER: 'Bundle ID',
  CFBundleDisplayName: '应用名称',
  CFBundleShortVersionString: '版本号',
  CFBundleVersion: 'build号', 
  kAPISalt: 'API Salt', 
  kAPIVersion: 'API Version', 
  kCompanyCode: '应用Code', 
  kIDCardScanDevcode: '身份证扫描', 
  kMobiletype: 'Mobile Type',
  kPlateNumberScanDevcode: '车牌扫描', 
  kTencentQQAppId: 'QQ ID',
  kTencentQQAppKey: 'QQ Key', 
  kUMengAppKeyString: '友盟 Key', 
  kUMengChannelID: '友盟Channel', 
  kVersionCheckType: 'Version Check Type',
  kWechatAppId: '微信 ID', 
  kWechatAppKey: '微信 Key',
  kAppUpdateUrl: '分享重定向地址',
  PROVISIONING_PROFILE_SPECIFIER: 'Provisioning profile',
  CODE_SIGN_IDENTITY: 'Identity',
  'aps-environment': 'APS Environment',
  'com.apple.developer.associated-domains': 'Associated Domains',
  'com.apple.security.application-groups': 'Application Groups',
  kWechatUniversalLink: '微信通用链',
  kQQUniversalLink: 'QQ通用链',
  DEVELOPMENT_TEAM: 'Team'
}

function translate (fieldname) {
  let output = fieldMap[fieldname]
  return output || fieldname
}

function requestDomain() {
  let protocol = window.location.protocol
  let hostname = window.location.hostname  
  return  protocol + '//' + hostname + ':3000'
}

function formatPrint (value) {
  if (value instanceof Array) {
    return value.join(',')
  } else {
    return value
  }
}

export {
  requestDomain,
  translate,
  makeUpdateInfo,
  formatPrint
}
