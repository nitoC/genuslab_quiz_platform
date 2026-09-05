
import React, { useState } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import './App.css'; // Import the CSS file
export default function PrePayment({ onSuccess }) {
	const userDetails = {
		name: 'Kelvin Joe Young',
		email: 'user@gmail.com',
		phonenumber: '07000001100',
		address: '123 Street Name, City, Country',
		delivery: 'Home Delivery',
	};
	// Dummy items in the cart
	const items = [
		{ id: 1, name: 'Wireless Mouse', price: 5000 },
		{ id: 2, name: 'Bluetooth Speaker', price: 12000 },
		{ id: 3, name: 'Smartwatch', price: 25000 },
	];

	// Calculate total amount
	const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

	// Payment state
	const [paymentCompleted, setPaymentCompleted] = useState(false);
	const [paymentResponse, setPaymentResponse] = useState(null);
}

// Step 5 - Define payment configuration
export default function PrePayment({onSuccess}) {
   // Dummy data and Payment state code goes here

   // Flutterwave payment configuration
   const config = {
      public_key: process.env.REACT_APP_FLW_SECRET_KEY,
      tx_ref: Date.now(),
      amount: totalAmount,
      currency: 'NGN',
      payment_options: 'card,mobilemoney,ussd',
      customer: {
         email: userDetails.email,
         phone_number: userDetails.phonenumber,
         name: userDetails.name,
      },
      customizations: {
         title: 'Store Purchase',
         description: 'Payment for items in your cart',
         logo: 'https://example.com/logo.png', // Your store logo
      },
   };

   const fwConfig = {
      ...config,
      text: 'Checkout',
      callback: (response) => {
         console.log(response);
         setPaymentCompleted(true); // Set payment as completed
         setPaymentResponse(response); // Store payment response
         onSuccess(response); // Trigger the success handler
         closePaymentModal(); // Close the payment modal
      },
      onClose: () => {
         console.log('Payment modal closed');
      },
   };
}

// Step 6 - Render the pre-payment page
export default function PrePayment({ onSuccess }) {
	// Flutterwave Configuration Code goes here

	return (
		<div className='container'>
			{paymentCompleted ? (
				// Show receipt after successful payment
				<div className='receipt'>
					<h1>Payment Complete</h1>
					<p>Thank you for your payment, {userDetails.name}!</p>
					<p>Transaction Reference: {paymentResponse?.tx_ref}</p>
					<p>Total Amount Paid: ₦{totalAmount}</p>
					<p>Items Purchased:</p>
					<ul>
						{items.map((item) => (
							<li key={item.id}>
								{item.name}: ₦{item.price}
							</li>
						))}
					</ul>
					<p>
						A receipt has been sent to your email:{' '}
						{userDetails.email}
					</p>
				</div>
			) : (
				// Show order confirmation and payment button before payment
				<>
					<h1>Order Confirmation</h1>
					<div>
						<h3>Items in your cart:</h3>
						<ul>
							{items.map((item) => (
								<li key={item.id}>
									{item.name}: ₦{item.price}
								</li>
							))}
						</ul>
						<h3>Total: ₦{totalAmount}</h3>
					</div>
					<div className='user-info'>
						<h3>User Information</h3>
						<p>Name: {userDetails.name}</p>
						<p>Email: {userDetails.email}</p>
						<p>Phone: {userDetails.phonenumber}</p>
						<p>Address: {userDetails.address}</p>
						<p>Method of delivery: {userDetails.delivery}</p>
					</div>
					{/* Flutterwave payment button */}
					<FlutterWaveButton {...fwConfig} />
				</>
			)}
		</div>
	);
}

// Step 7 - Add a success page
import React from 'react';
export default function PaymentSuccess({ paymentDetails }) {
	return (
		<div className='payment-success-page'>
			{/* Success icon (use an actual icon, e.g., from FontAwesome) */}
			<div className='success-icon'>✔️</div>
			<h1>Payment Successful!</h1>
			<p>Thank you, {paymentDetails.customer.name}.</p>
			<div className='transaction-details'>
				<p>
					Your payment of{' '}
					<span>
						{paymentDetails.currency} {paymentDetails.amount}
					</span>{' '}
					has been processed successfully.
				</p>
				<p>
					Transaction Reference: <span>{paymentDetails.tx_ref}</span>
				</p>
			</div>
		</div>
	);
}

// Step 8 - Update the main component
import React, { useState } from 'react';
import PrePaymentPage from './PrePayment';
import PaymentSuccess from './PaymentSuccess';
import './App.css';
export default function App() {
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [paymentDetails, setPaymentDetails] = useState(null);
	const handleSuccess = (details) => {
		setPaymentSuccess(true); // Mark payment as successful
		setPaymentDetails(details); // Store payment details for success page
	};
	return (
		<div className='App'>
			{!paymentSuccess ? (
				<PrePaymentPage onSuccess={handleSuccess} />
			) : (
				<PaymentSuccess paymentDetails={paymentDetails} />
			)}
		</div>
	);
}

// Step 9 - Deploy
//npm start