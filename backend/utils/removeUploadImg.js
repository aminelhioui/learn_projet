// Utilitaire pour supprimer un fichier uploadé
// Accepte :
// - un objet multer (avec .path ou .filename)
// - une URL contenant `/uploads/` (ex: /uploads/xxx)
// - un nom de fichier ou un chemin absolu
const fs = require('fs');
const path = require('path');

const removeUploadimg = (fileOrPath) => {
    if (!fileOrPath) return;

    // accept either a multer file object, a full path string, or a filename string
    let targetPath = null;

    if (typeof fileOrPath === 'string') {
        // if looks like URL (/uploads/xxx) extract filename
        if (fileOrPath.includes('/uploads/')) {
            const parts = fileOrPath.split('/uploads/');
            targetPath = path.join(__dirname, '..', 'uploads', parts[1]);
        } else {
            // treat as filename or absolute path
            targetPath = path.isAbsolute(fileOrPath) ? fileOrPath : path.join(__dirname, '..', 'uploads', fileOrPath);
        }
    } else if (fileOrPath.path) {
        targetPath = fileOrPath.path;
    } else if (fileOrPath.filename) {
        targetPath = path.join(__dirname, '..', 'uploads', fileOrPath.filename);
    }

    if (!targetPath) return;

    fs.unlink(targetPath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('failed to remove upload file:', err.message);
        }
    });
};

module.exports = removeUploadimg;