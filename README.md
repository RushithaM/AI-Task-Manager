# AI Task Manager Web App

A simple web app to organize the tasks with the help of AI.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js
- **Database**: MongoDB
- **Framework**: Express.js

## Screenshots

1. **Homepage**:
    ![HomePage](https://github.com/user-attachments/assets/b328c957-021b-4863-869a-73b3e747eb2c)

2. **Task Management Interface**:
   ![Task Management Interface](https://github.com/user-attachments/assets/466cf1ef-95e4-421f-b6dd-22c5004f4fa7)

3. **AI Assistant**:
   ![AI Assistant](https://github.com/user-attachments/assets/0128dc85-befa-4253-91e9-1a33fd12ab09)

## Live Demo
Experience the app live: [AI Task Manager Demo](https://ai-task-manager-brown.vercel.app/)

## Project Setup

### Clone the repository:
```bash
git clone https://github.com/RushithaM/AI-Task-Manager.git
```

### Install dependencies:
```bash
- Install backend dependencies
cd backend
npm install

- Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables:
Create a `.env` file in the `server` directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemin_api_key
PORT=5000
```

### Run the application:
```bash
- Start the server
cd backend
node server.js

- Start the frontend
cd ../frontend
npm start
```

### Access the application:
Open your browser and navigate to `http://localhost:3000`.

## Acknowledgements
Special thanks to the following resources for making this project possible:
- [React Documentation](https://react.dev/)
- [Gemini Documentation](https://ai.google.dev/gemini-api/docs)

