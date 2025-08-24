# Tasks

- [x] Set up a new project using Express and Prisma. Install all the necessary dependencies including Passport etc.
- [x] Set up session based authentication using Passport.js.
- [ ] Add folders. Users should be able to CRUD folders and upload files in them. Set up routes and necessary database interactions for this.
- [ ] Add a route to view specific file details like name, size, and upload time. There should be a download button to allow users to download the file.
- [ ] Add a form where authenticated users can upload a file. Save the file in your filesystem for now. You’ll need to integrate the [**multer middleware**](https://github.com/expressjs/multer).
- [ ] Add logic to upload files. You could store it in a database, but it’s advised to use a cloud storage service for this usecase. You can use [**Cloudinary**](https://cloudinary.com/) or [**Supabase storage**](https://supabase.com/docs/guides/storage). When a file is uploaded, save the file URL in the database.
- [ ] Add a share folder functionality. When a user wants to share a folder (and all of its contents), they should have a form to specify the duration i.e. 1d, 10d etc. This should generate a link that can be shared with anyone (unauthenticated users). For example, the link could be in the following format: `https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81`
