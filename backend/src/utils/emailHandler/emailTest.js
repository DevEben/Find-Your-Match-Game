// https://www.npmjs.com/package/zeptomail

// For ES6
const { SendMailClient } = require("zeptomail");

// For CommonJS
// var { SendMailClient } = require("zeptomail");

const url = "https://api.zeptomail.com/v1.1/email";
const token = "Zoho-enczapikey wSsVR611rB/5DKcvmmCqI7hrnQgABFKnRkR73FOk7CSqTf7Cpsduk0TJBVT1G6AaR2M/RWETpe0vykwD1DAN3NUomFAACyiF9mqRe1U4J3x17qnvhDzJW2RekRaOLIoLwwlrnWZkGsBu";

let client = new SendMailClient({url, token});

client.sendMail({
    "from": 
    {
        "address": "eventparcel.com",
        "name": "support"
    },
    "to": 
    [
        {
        "email_address": 
            {
                "address": "ebenezertope4@gmail.com",
                "name": "Ebenezer"
            }
        }
    ],
    "subject": "Test Email",
    "htmlbody": "<div><b> Test email sent successfully. from Event Parcel</b></div>",
}).then((resp) => console.log("success")).catch((error) => console.log("error: ", error));