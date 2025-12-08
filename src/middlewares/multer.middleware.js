import multer from 'multer'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })










/*
                                               project-root/
├── src/
│   ├── config/
│   │   └── cloudinary.config.js      # Cloudinary config + uploadOnCloudinary helper
│   │
│   ├── middlewares/
│   │   └── multer.middleware.js      # Multer setup (disk/memory storage)
│   │
│   ├── controllers/
│   │   └── fileUpload.controller.js  # Logic for handling upload & calling Cloudinary
│   │
│   ├── routes/
│   │   └── fileUpload.routes.js      # Routes for /upload, /avatar, etc.
│   │
│   ├── models/
│   │   └── user.model.js             # User schema (avatar, coverImage, etc.)
│   │
│   ├── utils/
│   │   └── ApiError.js               # Optional: common error class
│   │   └── ApiResponse.js            # Optional: common response format
│   │
│   ├── app.js                        # Express app setup (middlewares, routes)
│   └── index.js                      # Entry point (connect DB, start server)
│
├── uploads/                          # Temporary folder for Multer (if using diskStorage)
│   └── .gitkeep                      # To keep folder in git (optional)
│
├── .env                              # CLOUDINARY + DB + PORT configs
├── package.json
└── README.md                         # Optional
*/