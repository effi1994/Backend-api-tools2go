class CreateMessageHtml {
       constructor() { }

       createHtmlMessageResetPassword(verificationCode) {
              return `<html>
          <html>
          <head>
            <style>
              /* Container styles */
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f1f1f1;
              }
   
              /* Message box styles */
              .message-box {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
              }
              
              /* Heading styles */
              .heading {
                color: #333;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
              }
              
              /* Verification code styles */
              .verification-code {
                color: #ff0000;
                font-size: 56px;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
              }
              
              /* Instruction styles */
              .instruction {
                color: #666;
                font-size: 18px;
                line-height: 1.4;
                text-align: center;
                margin-bottom: 30px;
              }
              
              /* Additional info styles */
              .additional-info {
                color: #999;
                font-size: 14px;
                text-align: center;
                margin-top: 30px;
              }
              
              /* Success message styles */
              .success-message {
                color: green;
                margin-top: 10px;
                text-align: center;
              }
   
              /* Logo styles */
              .logo {
                display: block;
                margin: 0 auto;
                max-width: 200px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="message-box">
                <h1 class="heading">Reset Password</h1>
                <p class="verification-code" id="verification-code">${verificationCode}</p>
                <p class="instruction">Please use the above verification code to reset your password.</p>
                <p class="success-message" id="success-message"></p>
                <p class="additional-info">If you did not request a password reset, please ignore this message.</p>
              </div>
            </div>
            <script>
              window.addEventListener('DOMContentLoaded', function() {
                var verificationCodeElement = document.getElementById('verification-code');
                var verificationCode = verificationCodeElement.innerText;
                navigator.clipboard.writeText(verificationCode)
                  .then(function() {
                    var successMessageElement = document.getElementById('success-message');
                    successMessageElement.innerText = 'Verification code copied to clipboard!';
                  })
                  .catch(function() {
                    var successMessageElement = document.getElementById('success-message');
                    successMessageElement.innerText = 'Failed to copy verification code to clipboard.';
                  });
              });
            </script>
          </body>
        </html>`;
       }

       createHtmlMessageVerifyEmail(verificationCode) {
              return `<html>
           <head>
             <style>
               /* Container styles */
               .container {
                 width: 100%;
                 max-width: 600px;
                 margin: 0 auto;
                 padding: 20px;
                 font-family: Arial, sans-serif;
                 background-color: #f1f1f1;
               }
   
               /* Message box styles */
               .message-box {
                 background-color: #ffffff;
                 padding: 30px;
                 border-radius: 10px;
                 box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
               }
               
               /* Heading styles */
               .heading {
                 color: #333;
                 font-size: 28px;
                 font-weight: bold;
                 margin-bottom: 20px;
                 text-align: center;
               }
               
               /* Verification code styles */
               .verification-code {
                 color: #ff0000;
                 font-size: 56px;
                 font-weight: bold;
                 margin-bottom: 30px;
                 text-align: center;
               }
               
               /* Instruction styles */
               .instruction {
                 color: #666;
                 font-size: 18px;
                 line-height: 1.4;
                 text-align: center;
                 margin-bottom: 30px;
               }
               
               /* Additional info styles */
               .additional-info {
                 color: #999;
                 font-size: 14px;
                 text-align: center;
                 margin-top: 30px;
               }
               
               /* Success message styles */
               .success-message {
                 color: green;
                 margin-top: 10px;
                 text-align: center;
               }
             </style>
           </head>
           <body>
             <div class="container">
               <div class="message-box">
                 <h1 class="heading">Verify Email</h1>
                 <p class="verification-code">${verificationCode}</p>
                 <p class="instruction">Please use the above verification code to verify your email.</p>
                 <p class="success-message" id="success-message"></p>
                 <p class="additional-info">If you did not create an account, please ignore this message.</p>
               </div>
             </div>
           </body>
         </html>`;
       }
}

module.exports = new CreateMessageHtml();
