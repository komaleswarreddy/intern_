# Custom Form Builder (SaaS)

A modern, full-stack SaaS-style Form Builder built with the MERN stack, enabling users to create custom forms with rich question types, collect responses, and view analytics.

## 🚀 Features

### Form Editor (Admin Side)
- ✅ Create forms with title, description, and header images
- ✅ Rich question types: Categorize, Cloze, Comprehension
- ✅ Dynamic question builder with add/edit/delete functionality
- ✅ Image upload support for questions and headers
- ✅ Auto-save and manual save options
- ✅ Form settings (public/private, response limits, deadlines)

### Form Preview & Fill (User Side)
- ✅ Public preview links: `https://yourdomain.com/form/:id`
- ✅ Responsive design for mobile & desktop
- ✅ Dynamic form rendering based on question schema
- ✅ Structured input capture for all question types
- ✅ Image support for headers and questions

### Response Dashboard (Admin Side)
- ✅ View all form responses in tabular format
- ✅ Export responses to CSV/JSON
- ✅ Individual response details
- ✅ Visual statistics (coming soon)

## 🛠 Tech Stack

### Frontend
- **React.js** + **Vite** (fast bundling)
- **Tailwind CSS** with **ShadCN/UI** components
- **React Hook Form** for advanced form validation
- **Zod** for schema validation
- **React Router** for routing
- **Cloudinary** for image uploads

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Multer** + **Cloudinary SDK** for file handling
- **CORS** + **Helmet** + **Rate Limiting** for security

### Hosting
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary

## 📦 Question Types

### 🔹 Categorize
Drag-and-drop items into categories
- Example: Classify Apple, Carrot, Milk → Fruit, Vegetable, Dairy
- UI: Drag-drop interface using @dnd-kit

### 🔹 Cloze
Fill-in-the-blank type with partial hidden content
- Example: "The capital of France is ___."
- UI: Inline input boxes with dynamic tokenization

### 🔹 Comprehension
Long passage followed by multiple sub-questions
- Example: Paragraph + 3 multiple choice/fill-in-the-blank questions
- UI: Accordion or Tab system to group sub-questions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd custom-form-builder
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Server (.env)
cd server
cp .env.example .env
# Edit .env with your MongoDB and Cloudinary credentials

# Client (.env)
cd ../client
cp .env.example .env
# Edit .env with your backend URL
```

4. **Run the application**
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## 📁 Project Structure

```
custom-form-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript types
│   └── public/
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utility functions
│   └── uploads/          # Temporary file storage
└── README.md
```

## 🔗 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/forms` | Create new form |
| GET | `/api/forms/:id` | Get full form schema |
| POST | `/api/forms/:id/responses` | Submit a form response |
| GET | `/api/forms/:id/responses` | Get all responses of a form |
| POST | `/api/upload` | Upload header/question image |

## 🎨 UI/UX Features

- Modern design with ShadCN components
- Responsive layout for all devices
- Dark mode support
- Smooth animations and transitions
- Drag-and-drop functionality
- Skeleton loaders for better UX

## 🔐 Security Features

- Input sanitization (XSS prevention)
- Request validation with Zod
- CORS configuration
- Rate limiting
- Helmet for security headers

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
npm run build
# Deploy to Render/Railway
```

## 📝 Development Guidelines

- Use ESLint + Prettier for clean code
- Follow conventional commits
- Write meaningful commit messages
- Test thoroughly before deployment
- Use environment variables for all sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@customformbuilder.com or create an issue in the repository.

---

**Built with ❤️ using the MERN stack** 