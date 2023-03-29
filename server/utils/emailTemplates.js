const header = `<header style='align-items: stretch; display: flex; flex-shrink: 0; min-height: 3.25rem; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;'>
    <h1 style="text-align: center; text-transform: uppercase; background-image: linear-gradient(-225deg, #002cb0 0%, #44107a 29%, #ff1361 67%, #fff800 100%); background-size: 200% auto; color: #fff; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textclip 2s linear infinite; display: inline-block; font-weight: 700 !important; font-size: 3rem !important; margin-block-start: 0.83em; margin-block-end: 0.83em; line-height: 1.5;">Support Hero</h1>
</header>`;

const customerSignupHtml = (firstName, confirmationURL) => {
    return `${header}
    <main style="display: flex; flex-wrap: wrap; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-top: 2rem;">
        <p>Hello ${firstName},</p>
        <br/>
        <h2 style="text-align: center, text-transform: uppercase: background-image: linear-gradient(-225deg, #002cb0 0%, #44107a 29%, #ff1361 67%, #fff800 100%); background-size: 200% auto; color: #fff; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textclip 2s linear infinite; font-weight: 700 !important; font-size: 2.25rem !important">Welcome to Support Hero!</h2>
        <br/>
        <p>You have successfully registered for an account, but you must confirm your email address before you can continue. <span style="font-weight: 700">Click the button below within 12 hours</span> to confirm your email address. If your activation button has expired, please visit the Support Hero <a href="https://dry-fjord-88699.herokuapp.com/">website</a> and click "Resend Activation Email."</p>
        <br/>
        <div style="display: flex; justify-content: center; margin: 1rem; width: 100%">
            <a href="${confirmationURL}">
                <button style="background-color: #9159cd; color: #fff; border: none; box-shadow: 3px 3px 8px #5e2798; vertical-align: middle !important; padding: 0rem 0.75rem 0rem 0.75rem; cursor: pointer; justify-content: center; text-align: center; white-space: nowrap; user-select: none; height: 2.5em; fint-size: 1rem;">Confirm Email</button>
            </a>
        </div>
        <br/>
        <p>After confirming your email address, you will have full access to Support Hero, including the ability to submit tickets. Please do not reply to this email. We look forward to helping you with any customer service issues that may arise.</p>
        <br/>
        <p>Regards,</p>
        <br/>
        <br/>
        <p>The Support Hero Team</p>
    </main>`
}

const ticketCreatedHtml = (firstName, ticketId, ticketTitle, issueType, priority, description) => {
    return `${header}
    <main style="display: flex; flex-wrap: wrap; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-top: 2rem;">
        <p>Hello ${firstName},</p>
        <br/>
        This email is to acknowledge that we have received your ticket for customer support, and you can expect a response within one business day. You may check the status of your ticket or add additional details at any time <a href="https://dry-fjord-88699.herokuapp.com/tickets/${ticketId}">here</a>.
        <br/>
        <div style="display: flex; justify-content: center; margin: 1rem; width: 100%">
            <section style="margin: 0 1.5rem 1rem 1.5rem; background-color: #ededed; border-radius: 0.25rem; padding: 1rem; box-shadow: 3px 3px 8px #787878;">
                <h2 style="margin-bottom: 1em;">Ticket Details</h2>
                <p><span style="font-weight:700;">Ticket Number: </span>${ticketId}</p>
                <p><span style="font-weight:700;">Title: </span>${ticketTitle}</p>
                <p><span style="font-weight:700;">Issue Type: </span>${issueType}</p>
                <p><span style="font-weight:700;">Priority: </span>${priority}</p>
                <br/>
                <p><span style="font-weight:700;">Description: </span>${description}</p>
            </section>
        </div>
        <br/>
        <p>Regards,</p>
        <br/>
        <br/>
        <p>The Support Hero Team</p>
    </main>`
}

const commentAddedByAgentHtml = (firstName, ticketId, status, agentFirstName, commentDate, commentText) => {
    return `<style scoped>
        .comment-header {
            color: #fff;
            background-color: #5471d0;
            border: 2px solid #5471d0;
            box-shadow: 3px 3px 9px #2e4eb7;
            border-radius: 5px;
            padding-left: 0.75rem important!;
            padding-right: 0.75rem important!;
            margin: -0.75rem -0.75rem 0.75rem -0.75rem;
        }
        .comment-date {
           display: block;
           flex-basis: 0;
           flex-grow: 1;
           flex-shrink: 1;
           padding: 0.75rem;
           margin-block-start: 1em;
           margin-block-end: 1em;
           margin-inline-start: 0px;
           margin-inline-end: 0px;
           color: #fff;
        }
        @media screen and (min-width: 769px) {
            .comment-header {
                display: flex;
            }
            .comment-date {
                text-align: right !important;
            }
        }
    </style>
    ${header}
    <main style="display: block; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-top: 2rem;">
        <p>Hello ${firstName},</p>
        <br/>
        <p>An agent has added a comment to your ticket number <a href="https://dry-fjord-88699.herokuapp.com/tickets/${ticketId}">${ticketId}</a>. The status of your ticket has been updated to <span style="font-weight: 700">${status}</span>.</p>
        <br/>
        <div style="display: flex; justify-content: center; margin: 1rem; width: 100%">
            <section style="background-color: #fff; box-shadow: 2px 2px 9px rgb(84, 84, 84); border-radius: 5px; margin: 1.5rem !important;">
                <header class="comment-header">
                    <p style="color: #fff; font-size: 1.25rem !important; display: block; flex-basis: 0; flex-grow: 1; flex-shrink: 1; padding: 0.75rem; font-weight: 700; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; line-height: 1.5;">${agentFirstName}</p>
                    <p class="comment-date">${commentDate}</p>
                </header>
                <div style="border-bottom-left-radius: 0.25rem; border-bottom-right-radius: 0.25rem; background-color: transparent; padding: 1.5rem; display: block; color: black;">
                    <div style="padding-left: 0.75rem !important; padding-right: 0.75rem!important; display: block; color: black;">
                        <p style="display: block; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; color: black;">${commentText}</p>
                    </div>
                </div>
            </section>
        </div>
        <br/>
        <p>Regards,</p>
        <br/>
        <br/>
        <p>The Support Hero Team</p>
    </main>`
}

const commentAddedByCustomerHtml = (firstName, ticketId, status, customerFirstName, commentDate, commentText) => {
    return `<style scoped>
        .comment-header {
            color: #fff;
            background-color: #5471d0;
            border: 2px solid #5471d0;
            box-shadow: 3px 3px 9px #2e4eb7;
            border-radius: 5px;
            padding-left: 0.75rem important!;
            padding-right: 0.75rem important!;
            margin: -0.75rem -0.75rem 0.75rem -0.75rem;
        }
        .comment-date {
            display: block;
            flex-basis: 0;
            flex-grow: 1;
            flex-shrink: 1;
            padding: 0.75rem;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            color: #fff;
        }
        @media screen and (min-width: 769px) {
            .comment-header {
                display: flex;
            }
            .comment-date {
                text-align: right !important;
            }
        }
    </style>
    ${header}
    <main style="display: block; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-top: 2rem;">
        <p>Hello ${firstName},</p>
        <br/>
        <p>The customer has added a comment to ticket number <a href="https://dry-fjord-88699.herokuapp.com/tickets/${ticketId}">${ticketId}</a>. The status of this ticket is now <span style="font-weight: 700">${status}</span>.
        <br/>
        <div style="display: flex; justify-content: center; margin: 1rem; width: 100%">
            <section style="background-color: #fff; box-shadow: 2px 2px 9px rgb(84, 84, 84); border-radius: 5px; margin: 1.5rem !important;">
                <header class="comment-header">
                    <p style="color: #fff; font-size: 1.25rem !important; display: block; flex-basis: 0; flex-grow: 1; flex-shrink: 1; padding: 0.75rem; font-weight: 700; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; line-height: 1.5;">${customerFirstName}</p>
                    <p class="comment-date">${commentDate}</p>
                </header>
                <div style="border-bottom-left-radius: 0.25rem; border-bottom-right-radius: 0.25rem; background-color: transparent; padding: 1.5rem; display: block; color: black;">
                    <div style="padding-left: 0.75rem !important; padding-right: 0.75rem!important; display: block; color: black;">
                        <p style="display: block; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; color: black;">${commentText}</p>
                    </div>
                </div>
            </section>
        </div>
    </main>`
}

const ticketClosedHtml = (firstName, ticketId) => {
    return `${header}
    <main style="display: flex; flex-wrap: wrap; font-family: BlinkMacSystemFont, -apple-system, Segoe UI, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-top: 2rem;">
        <p>Hello ${firstName},</p>
        <br/>
        <p>Your ticket number <a href="https://dry-fjord-88699.herokuapp.com/tickets/${ticketId}">${ticketId}</a> has been closed. Thank you for the opportunity to serve you! We hope your issue has been resolved to your satisfaction.</p>
        <br/>
        <p>Please click the button below to provide your feedback regarding the service you received.</p>
        <br/>
        <div style="display: flex; justify-content: center; margin: 1rem; width: 100%">
            <a style="background-color: #9159cd; color: #fff; border: none; box-shadow: 3px 3px 8px #5e2798; vertical-align: middle !important; padding: 0.5em; 2em; cursor: pointer; justify-content: center; text-align: center; white-space: nowrap; user-select: none; height: 2.5em; font-size: 1rem; text-decoration: none" href="https://dry-fjord-88699.herokuapp.com/login?redirect=/tickets/${ticketId}&feedback=true}">Submit Feedback</a>
        </div>
        <br/>
        <p>Regards,</p>
        <br/>
        <br/>
        <p>The Support Hero Team</p>
    </main>`
}

module.exports = { customerSignupHtml, commentAddedByAgentHtml, commentAddedByCustomerHtml, ticketClosedHtml, ticketCreatedHtml }