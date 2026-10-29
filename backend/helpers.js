function isAdminRole(role){
    return role === "root" || role === "admin";
}

function getS3Key(imagepath, bucket, region){
    const prefix =`https://${bucket}.s3.${region}.amazonaws.com/`;
    if(!imagepath || !imagepath.startsWith(prefix)) return null;
    return imagepath.slice(prefix.length);
}

module.exports = {isAdminRole, getS3Key};