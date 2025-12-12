const fs = require("fs");

const removeUploadimg = (filePath) => {
    if(!filePath || !filePath ) return;
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error("failed to remove upload file:", err.message);
        }
    });
};
module.exports = removeUploadimg