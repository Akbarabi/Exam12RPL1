import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req,res, cb) => {
        cb(null, '../saves') //
    },
    filename: (req, file, cb) => {

    }
})