document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', function() {
      compose_email();
  });

  // Add event listener to compose form
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // Add email-view div if it doesn't exist
  if (!document.querySelector('#email-view')) {
      const emailView = document.createElement('div');
      emailView.id = 'email-view';
      emailView.style.display = 'none';
      document.querySelector('body').appendChild(emailView);
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(recipient = '', subject = '', body = '') {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Hide email-view if it exists
  const emailView = document.querySelector('#email-view');
  if (emailView) {
      emailView.style.display = 'none';
  }

  // Clear out composition fields with provided values or empty strings
  document.querySelector('#compose-recipients').value = recipient;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function send_email(event) {
  // Prevent default form submission
  event.preventDefault();

  // Get form data
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send email via POST request
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
  })
  .then(response => response.json())
  .then(result => {
      // Check for errors
      if (result.error) {
          // Display error message
          alert(result.error);
      } else {
          // Load sent mailbox on success
          load_mailbox('sent');
      }
  })
  .catch(error => {
      console.log('Error:', error);
      alert('An error occurred while sending the email.');
  });
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Hide email-view if it exists
  const emailView = document.querySelector('#email-view');
  if (emailView) {
      emailView.style.display = 'none';
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails for this mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(emails => {
      // If no emails, display message
      if (emails.length === 0) {
          const noEmailsMessage = document.createElement('p');
          noEmailsMessage.textContent = 'No emails in this mailbox.';
          document.querySelector('#emails-view').appendChild(noEmailsMessage);
          return;
      }

      // Create div for each email
      emails.forEach(email => {
          const emailElement = document.createElement('div');
          emailElement.classList.add('email');
          emailElement.style.border = '1px solid #ccc';
          emailElement.style.margin = '10px 0';
          emailElement.style.padding = '10px';
          emailElement.style.backgroundColor = email.read ? '#e9e9e9' : 'white';
          emailElement.style.cursor = 'pointer';

          // Create email content
          emailElement.innerHTML = `
              <span class="sender"><strong>${email.sender}</strong></span>
              <span class="subject">${email.subject}</span>
              <span class="timestamp" style="float: right; color: #999;">${email.timestamp}</span>
          `;

          // Add click event to view the email
          emailElement.addEventListener('click', function() {
              view_email(email.id);
          });

          // Add the email to emails-view
          document.querySelector('#emails-view').appendChild(emailElement);
      });
  })
  .catch(error => {
      console.log('Error:', error);
      document.querySelector('#emails-view').innerHTML += '<p>Error loading emails.</p>';
  });
}

function view_email(email_id) {
  // Hide other views and show email view
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Get or create email-view
  let emailView = document.querySelector('#email-view');
  if (!emailView) {
      emailView = document.createElement('div');
      emailView.id = 'email-view';
      document.querySelector('body').appendChild(emailView);
  }

  // Clear previous content and show this view
  emailView.innerHTML = '<p>Loading email...</p>';
  emailView.style.display = 'block';

  // Fetch the email content
  fetch(`/emails/${email_id}`)
  .then(response => {
      if (!response.ok) {
          throw new Error('Email not found');
      }
      return response.json();
  })
  .then(email => {
      // Mark as read if not already
      if (!email.read) {
          fetch(`/emails/${email_id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  read: true
              })
          });
      }

      // Clear existing content
      emailView.innerHTML = '';

      // Create email header section
      const headerDiv = document.createElement('div');
      headerDiv.innerHTML = `
          <p><strong>From:</strong> ${email.sender}</p>
          <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
          <p><strong>Subject:</strong> ${email.subject}</p>
          <p><strong>Timestamp:</strong> ${email.timestamp}</p>
      `;
      emailView.appendChild(headerDiv);

      // Add horizontal rule
      const hr = document.createElement('hr');
      emailView.appendChild(hr);

      // Add email body
      const bodyDiv = document.createElement('div');
      bodyDiv.style.whiteSpace = 'pre-wrap';
      bodyDiv.style.marginBottom = '20px';
      bodyDiv.textContent = email.body;
      emailView.appendChild(bodyDiv);

      // Add buttons container
      const buttonsDiv = document.createElement('div');
      buttonsDiv.style.marginTop = '20px';

      // Add reply button
      const replyButton = document.createElement('button');
      replyButton.textContent = 'Reply';
      replyButton.className = 'btn btn-primary mr-2';
      replyButton.addEventListener('click', function() {
          reply_to_email(email);
      });
      buttonsDiv.appendChild(replyButton);

      // Add archive button (only for inbox/archive emails that the user received)
      if (email.recipients.includes(document.querySelector('h2').textContent)) {
          const archiveButton = document.createElement('button');
          archiveButton.className = 'btn btn-secondary ml-2';

          if (!email.archived) {
              archiveButton.textContent = 'Archive';
              archiveButton.addEventListener('click', function() {
                  archive_email(email.id, true);
              });
          } else {
              archiveButton.textContent = 'Unarchive';
              archiveButton.addEventListener('click', function() {
                  archive_email(email.id, false);
              });
          }

          buttonsDiv.appendChild(archiveButton);
      }

      emailView.appendChild(buttonsDiv);
  })
  .catch(error => {
      console.log('Error:', error);
      emailView.innerHTML = '<p>Error loading email.</p>';
  });
}

function archive_email(email_id, archived) {
  // Send PUT request to archive/unarchive
  fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: archived
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update email');
      }
      // Load inbox after archiving/unarchiving
      load_mailbox('inbox');
  })
  .catch(error => {
      console.log('Error:', error);
      alert('Error updating email archive status');
  });
}

function reply_to_email(email) {
  // Prepare recipient (the original sender)
  const recipient = email.sender;

  // Prepare subject line with "Re: " prefix if needed
  let subject = email.subject;
  if (!subject.startsWith('Re: ')) {
      subject = `Re: ${subject}`;
  }

  // Prepare body with original message
  const body = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n\n`;

  // Call compose_email with prefilled values
  compose_email(recipient, subject, body);
}
