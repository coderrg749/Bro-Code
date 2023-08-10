const multer = require('multer')
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profileImageURL' && file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/avatar');
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/post-images');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, 'uploads/post-videos');
    } else {
      cb(new Error('Unsupported file type!'), null);
    }
  },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
    })
    
    // Define the file filter to allow only image files
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image and video files are allowed!'), false);
          }
      };
      const upload = multer({ storage, fileFilter }).single('profileImageURL');
      const postUpload = multer({ storage, fileFilter }).single('img_vid_URL');
      module.exports={upload,postUpload};