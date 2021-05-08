const qiniu = require('qiniu');

var accessKey = 'jBrm6dlbqKmtnd5Xq27sjdZmKtOeA7AaYdfAh2HQ';
var secretKey = 'deVvbj-ns33X7ATl7ZWbNhvfOPKGLRoFu8lxTF2K';

function qiniuToken() {
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
        scope: 'h5-app',
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","fname":"$(fname)","mimeType":"$(mimeType)","test":"$(x:test)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken

}


module.exports = {
    qiniuToken
}