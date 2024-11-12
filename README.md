# Material Library Admin App

This is a React application that manages material documents and products.

## Getting Started

### Prerequisites

- Node.js
- MySQL
- npm

### Installation

1. Clone the repository.
2. Create a `.env` file based on the `.env.example` file with your own configuration.
3. This system is designed to operate using the local file system, without relying on a database server proxy. All document operations, including viewing, uploading, and deleting files, are handled directly on the local hard drive. We have implemented a static file storage solution using multer, a middleware for handling multipart/form-data in Node.js applications, which is particularly suited for file uploads.
**Setting Up the Local Dataset Directory Structure**
Before you begin, ensure that you have created a parent directory named **dataset** on your local machine. Within this directory, you will create several subdirectories to organize different types of files, such as documents, videos, and images. Here's how you can structure your dataset directory:
>dataset
>├── mdocuments
>├── mvideo
>├── mmusic
>├── mimages
>├── mbackground
>├── msound
>├── pdocument
>├── pdigital
>├── pimages
>├── pmusic
>└── pvideo
**Configuring the config.js File**
To manage the paths for your dataset, you can use the following config.js file. This file allows you to easily change the base directory (baseDir) and the corresponding subdirectories for different file types. **Make sure that the baseDir ends with /dataset to maintain consistency.**
Explanation
- baseDir: This is the path to the parent directory named dataset. It should be an absolute path and should end with /dataset. Update this path according to your local setup.
- directories: This object maps the names of different file types to their respective subdirectories within the dataset directory. For example, 'MaterialsDocuments' is mapped to 'mdocuments', which means all document files for materials will be stored in the mdocuments folder.
4. Database Configuration
```
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `work_number` varchar(30) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` varchar(50) DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE material_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE product_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE material_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE material_background (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE material_music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE material_sound (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE product_music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE material_video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE product_video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    tag VARCHAR(255)
);
CREATE TABLE product_digitalv (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  tag VARCHAR(255),
  anchor VARCHAR(30) NOT NULL,
  technique VARCHAR(255) NOT NULL
);
```
5. Install dependencies:

```bash
npm install
npm start
npm run build
```