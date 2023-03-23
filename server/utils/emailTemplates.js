const customerSignupHtml = (firstName) => {
    return `<header style='align-items: stretch; display: flex; flex-shrink: 0; min-height: 3.25rem; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;'>
        <h1 style="text-align: center; text-transform: uppercase; background-image: linear-gradient(-225deg, #002cb0 0%, #44107a 29%, #ff1361 67%, #fff800 100%); background-size: 200% auto; color: #fff; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textclip 2s linear infinite; display: inline-block; font-weight: 700 !important; font-size: 3rem !important; margin-block-start: 0.83em; margin-block-end: 0.83em; line-height: 1.5;">Support Hero</h1>
    </header>
    <main style="display: flex; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; justify-content: center;">
        <p>Hello ${firstName},</p>
        <br/>
        <h2 style="text-align: center, text-transform: uppercase: background-image: linear-gradient(-225deg, #002cb0 0%, #44107a 29%, #ff1361 67%, #fff800 100%); background-size: 200% auto; color: #fff; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textclip 2s linear infinite; font-weight: 700 !important; font-size: 2.25rem !important">Welcome to Support Hero!</h2>
        <br/>
        <p>You have successfully registered for an account, but you must confirm your email address before you can continue. <span style="font-weight: 700">Click the button below within 12 hours</span> to confirm your email address. If your activation button has expired, please visit the Support Hero <a href="https://dry-fjord-88699.herokuapp.com/">website</a> and click "Resend Activation Email."</p>
        <br/>
        <button style="background-color: #9159cd; color: #fff; border: none; box-shadow: 3px 3px 8px #5e2798; vertical-align: middle !important; padding: 0rem 0.75rem 0rem 0.75rem; cursor: pointer; justify-content: center; text-align: center; white-space: nowrap; user-select: none; height: 2.5em; fint-size: 1rem;">Confirm Email</button>
        <br/>
        <p>After confirming your email address, you will have full access to Support Hero, including the ability to submit tickets. Please do not reply to this email. We look forward to helping you with any customer service issues that may arise.</p>
        <br/>
        <p>Regards,</p>
        <br/>
        <br/>
        <p>The Support Hero Team</p>
    </main>`
}