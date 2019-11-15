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
}

function translate (string) {
  return fieldMap[string]
}

export {
  translate
}
