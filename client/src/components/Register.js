import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik components for form handling
import * as Yup from 'yup'; // Import Yup for form validation

const Register = () => {
  // Define the initial values for the form fields
  const initialValues = {
    name: '', // Initial value for the name field
    email: '', // Initial value for the email field
    password: '', // Initial value for the password field
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'), // Name must be a string and is required
    email: Yup.string().email('Invalid email format').required('Email is required'), // Email must be valid and is required
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'), // Password must be at least 6 characters and is required
  });

  // Function to handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Send a POST request to the server for registration
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST', // HTTP method for the request
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(values), // Convert form values to JSON
      });

      // Check if the response indicates a successful registration
      if (response.ok) {
        // Handle successful registration
        alert('Registration successful'); // Show success message
        resetForm(); // Reset the form fields
      } else {
        // Handle errors returned from the server
        const errorData = await response.json(); // Parse the JSON response
        alert(`Registration failed: ${errorData.message}`); // Show error message
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur during the fetch
      alert('An error occurred while registering. Please try again.'); // Show general error message
    }
  };

  return (
    <Formik
      initialValues={initialValues} // Pass initial values to Formik
      validationSchema={validationSchema} // Pass the validation schema to Formik
      onSubmit={handleSubmit} // Pass the handleSubmit function to Formik
    >
      {/* Formik will manage the form state and validation */}
      <Form>
        <div>
          <label htmlFor="name">Name:</label>
          <Field type="text" id="name" name="name" /> {/* Input field for name */}
          <ErrorMessage name="name" component="div" /> {/* Display validation error for name */}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <Field type="email" id="email" name="email" /> {/* Input field for email */}
          <ErrorMessage name="email" component="div" /> {/* Display validation error for email */}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <Field type="password" id="password" name="password" /> {/* Input field for password */}
          <ErrorMessage name="password" component="div" /> {/* Display validation error for password */}
        </div>
        <button type="submit">Register</button> {/* Button to submit the form */}
      </Form>
    </Formik>
  );
};

export default Register; // Export the Register component for use in other parts of the application
