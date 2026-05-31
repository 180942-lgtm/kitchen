const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,          // 支付宝要求 2048 位
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',              // 支付宝要求 PKCS#8 格式
    format: 'pem',
  }
});

// 保存文件
fs.writeFileSync(path.join(__dirname, 'private_key.pem'), privateKey);
fs.writeFileSync(path.join(__dirname, 'public_key.pem'), publicKey);

console.log('========== 支付宝应用公钥（请复制到支付宝沙箱）==========');
console.log(publicKey);
console.log('========== 应用私钥（已保存到 private_key.pem，务必保密）==========');
console.log(privateKey);
console.log('\n文件已生成在当前文件夹：private_key.pem 和 public_key.pem');