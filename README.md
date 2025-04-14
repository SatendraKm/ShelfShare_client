# ShelfShare
Peer-to-Peer Book Exchange Portal for Book owners and Book seekers
# ShelfShare: Frontend Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Frontend Setup](#frontend-setup)
4. [Pages & Components](#pages-and-components)
   - [Home Page](#home-page)
   - [Login/Signup](#loginsignup)
   - [Book List](#book-list)
   - [Book Detail](#book-detail)
   - [Library](#library)
   - [Profile](#profile)
5. [Authentication & Protected Routes](#authentication-and-protected-routes)
6. [State Management](#state-management)
7. [Styling](#styling)

## Introduction
The frontend of **ShelfShare** is built using **React.js** and **Next.js**. It provides a user-friendly interface for browsing, listing, borrowing, and exchanging books. The frontend communicates with the backend via API calls and handles routing, user authentication, and dynamic rendering of book data.

## Tech Stack
- **React.js** for building user interfaces.
- **Next.js** for server-side rendering and routing.
- **DaisyUI** for UI components.
- **Tailwind CSS** for styling.
- **Axios** for HTTP requests.
- **React Context API** for state management.

## What's not working
1. issue with the PATCH APIs due to CORS error-
	1. cannot update password in profile
	2. cannot update profile data on profile page
2. Image upload in deployed version of the application on vercel
Note- rest i have covered all the features including some extra features also like requesting books, dark mode across the application, etc.

## Frontend Setup

1. Clone the repository:
```bash
   git clone https://github.com/SatendraKm/ShelfShare_client.git
```
   
2. Navigate to the project directory:
```bash
cd ShelfShare-client
```

3. set the .env file at the root directory
```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
``` 
3. Install dependencies:
```bash
npm install
```

5. Run the project locally:
```bash
npm run dev
```
The frontend should be available at http://localhost:3000.

## Pages & Components
### Home Page
The Home Page is the public landing page of the application. It is accessible to all users and provides information about the platform, including the key features and call-to-action buttons for login or signup.

### Login/Signup
Login Page: Allows existing users to authenticate using their email and password. Once authenticated, the user is redirected to their profile or the book listing page.

Signup Page: Allows new users to register by providing their details (email, name, phone number).

### Book List
This page displays all available books in the system. Users can filter books by genre, author, and location. From this page, users can either request to borrow books or list their own books for rent/exchange.

### Book Detail
The Book Detail page shows detailed information about a specific book. Users can:

Request to borrow the book if they are a seeker.

Edit or delete the book if they are the owner.

### Library
The Library Page shows all books that the logged-in user has either borrowed or exchanged. It is a protected route and can only be accessed by authenticated users.

### Profile
The Profile Page displays the user's personal information, including their name, email, and phone number. It also allows users to manage their listed books and view the status of borrowed books.

### Authentication & Protected Routes
The frontend uses JWT tokens for user authentication. After a user logs in, the backend sends a JWT token, which is stored in Cookies. The token is then included in the Authorization header for all protected routes.

Protected Routes: Pages such as Library and Profile are accessible only to authenticated users.

### React Context API: Used to manage authentication state across the application. The AuthContext provides the user's authentication status and allows easy access to it in any component.

State Management
State is managed using React Context API for global state and useState for component-specific state. The AuthContext is used to manage user authentication across the application, while useState is used in specific pages like the book listing to manage the filtered results or book details.

Styling
Tailwind CSS is used for utility-first CSS styling. It allows fast, responsive designs with minimal custom CSS.

DaisyUI is integrated with Tailwind CSS for pre-built UI components like buttons, forms, modals, and more.

## vercel deployed link - https://shelf-share-web.vercel.app/
