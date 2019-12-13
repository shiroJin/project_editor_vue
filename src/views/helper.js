function makeUpdateInfo (orig, dest) {
  let result = {}
  Object.keys(orig).forEach(key => {
    if (dest.hasOwnProperty(key)) {
      let origValue = orig[key]
      let destValue = dest[key]
      if (Array.isArray(origValue) && Array.isArray(destValue)) {
        if (origValue.length !== destValue.length) {
          result[key] = dest[key]
        } else {
          for (let index = 0; index < origValue.length; index++) {
            if (origValue[index] !== destValue[index]) {
              result[key] = dest[key]
              break
            }
          }
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
  kDistributioneBaseCommonUrl: '基础接口地址',
  kJPushAppKeyString: '极光App Key',
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
  kTencentQQAppId: 'QQ App Id',
  kTencentQQAppKey: 'QQ App Key', 
  kUMengAppKeyString: '友盟App Key', 
  kUMengChannelID: '友盟Channel', 
  kVersionCheckType: 'Version Check Type',
  kWechatAppId: '微信App Id', 
  kWechatAppKey: '微信App Key',
  kAppUpdateUrl: 'APP更新地址',
  PROVISIONING_PROFILE_SPECIFIER: '描述文件',
  CODE_SIGN_IDENTITY: '签名'
}

function translate (fieldname) {
  let output = fieldMap[fieldname]
  return output || fieldname
}

function getRequestDomain() {
  let protocol = window.location.protocol
  let hostname = window.location.hostname  
  return  protocol + '//' + hostname + ':3000'
}

export {
  getRequestDomain,
  translate,
  makeUpdateInfo
}
