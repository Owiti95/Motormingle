import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from './UserContext'; // Import the UserContext

const Login = ({ onCancel }) => {
  const { setUser } = useContext(UserContext); // Use the context to set user

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:5555/login', { // Updated to match your API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Invalid login credentials');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Set user role in context
        setUser({ ...data.user, isAdmin: data.user.is_admin }); // Assuming is_admin is sent back

        // Redirect logic or state management goes here
        // Example: window.location.href = '/dashboard';

      } catch (error) {
        console.error('Login error:', error);
        // Handle error (e.g., display error message)
      }
    },
  });

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit">Login</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default Login;
