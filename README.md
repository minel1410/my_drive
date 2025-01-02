# My Drive

My Drive is a personal cloud storage web application built with **Next.js** and **FastAPI**. It provides users with a secure and efficient platform for uploading, managing, and accessing files from anywhere.

## Key Features
- **Frontend**: Built using [Next.js](https://nextjs.org/), providing fast page loads and seamless routing.
- **Backend**: Powered by [FastAPI](https://fastapi.tiangolo.com/), enabling a robust and scalable API.
- **File Upload and Management**: Users can upload, organize, and retrieve files securely.
- **Authentication**: Features password-based authentication for secure user access.
- **Responsive Design**: Ensures usability across devices with [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and [Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox).

## Project Structure
```plaintext
.
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI application entry point
│   │   ├── routes/       # API route definitions
│   │   ├── models/       # Database models
│   │   ├── utils/        # Helper functions
├── frontend/
│   ├── components/       # Reusable React components
│   ├── pages/            # Next.js pages for routing
│   ├── styles/           # Global and module-specific styles
├── public/
│   ├── assets/           # Static assets (e.g., icons, images)
├── .gitignore            # Git ignored files
├── README.md             # Project documentation
├── package.json          # Frontend dependencies
├── requirements.txt      # Backend dependencies
```

### Notable Directories
- **backend/app/routes/**: Contains API endpoints for managing user authentication, file operations, and more.
- **frontend/components/**: Modular and reusable UI components.

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
