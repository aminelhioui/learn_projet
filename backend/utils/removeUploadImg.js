const fs = require("fs");

const removeUploadimg = (file) => {
    if(!file || !file.Path ) return;
    fs.unlink(file.Path, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error("failed to remove upload file:", err.message);
        }
    });
};
module.exports = removeUploadimg