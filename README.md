# Django React Prerad Ecommerce

Welcome to the Prerad Motorparts Ecommerce Webshop! This project features a powerful Django backend and CMS with a sleek React frontend. The payment processing is seamlessly handled by Stripe.

## Features

- **Django Backend**: Robust and secure server-side logic with CMS functionality.
- **React Frontend**: Fast and responsive user interface.
- **Stripe Integration**: Secure and reliable payment processing.
- **Modular Design**: Easy to extend and maintain.

## Installation

### Backend Development Workflow

First, set up your Python virtual environment and install the necessary dependencies:

```bash
virtualenv env
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Development Workflow

Next, install the frontend dependencies and start the development server:

```bash
npm install
npm start
```

## Usage

To start using the ecommerce platform:

1. Ensure the backend server is running:
    ```bash
    python manage.py runserver
    ```
2. In a separate terminal, start the frontend development server:
    ```bash
    npm start
    ```
3. Open your browser and navigate to `http://localhost:3000` to view the frontend.

## Deployment

For deploying the application, build the frontend assets:

```bash
npm run build
```

Then, follow your preferred deployment strategy for both the Django backend and the static frontend files.

## Contributing

We welcome contributions to enhance this project! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.


Thank you for checking out the Prerad Motorparts Ecommerce Webshop! If you have any questions or feedback, feel free to reach out.
