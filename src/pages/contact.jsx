import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
// hooks/useIP.js

const sup = {
  verticalAlign: "super",
  fontSize: "smaller",
};

export function Contact() {
  const [formData, setFormData] = useState({
    from_name: "",
    from_company: "",
    from_email: "",
    message: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [ip, setIP] = useState("");

  useEffect(() => {
    document.getElementById("name").addEventListener("input", validateMessage);
    document.getElementById("message").addEventListener("input", validateMessage);

    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => setIP(data.ip))
      .catch((err) => console.error(err));

    return () => {
      if (document.getElementById("name")) {
        document.getElementById("name").removeEventListener("input", validateMessage);
      }
      if (document.getElementById("message")) {
        document.getElementById("message").removeEventListener("input", validateMessage);
      }
    };
  }, []);

  console.log("IP Address: ", ip);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateMessage = () => {
    const nameField = document.getElementById("name");
    const messageField = document.getElementById("message");

    const constraint = new RegExp(/<(.|\n)*?>/g, "");

    if (constraint.test(nameField.value)) {
      nameField.setCustomValidity("HTML tags are not allowed in the name field.");
      setIsFormValid(false);
    } else {
      nameField.setCustomValidity("");
    }
    if (constraint.test(messageField.value)) {
      messageField.setCustomValidity("HTML tags are not allowed in the message field.");
      setIsFormValid(false);
    } else {
      messageField.setCustomValidity("");
    }

    return setIsFormValid(true);
  };

  const sendEmail = (data) => {
    emailjs
      .send(import.meta.env.VITE_APP_EJS_SERVICE, import.meta.env.VITE_APP_EJS_TEMPLATE, data, {
        publicKey: import.meta.env.VITE_APP_EJS_PUBLIC,
      })
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
        },
        (error) => {
          console.error("Email sending failed:", error);
        }
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // for example, sending the data to an email or a server endpoint.
    validateMessage();
    if (!isFormValid) return;
    sendEmail(formData);
    // Reset form fields
    setFormData({ from_name: "", from_company: "", from_email: "", message: "" });
  };

  const onChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <div className='flex place-items-center w-full h-full'>
      <div className='flex flex-col place-items-center w-full max-w-[50%] mx-auto'>
        <ReCAPTCHA sitekey={import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY} onChange={onChange} />
        <h1 className='text-3xl font-bold text-center'>Contact Me</h1>
        <form onSubmit={handleSubmit} className='w-full'>
          <div className='flex flex-col'>
            <label htmlFor='name'>
              Name<span style={sup}>*</span>:
            </label>
            <input type='text' id='name' name='from_name' value={formData.from_name} onChange={handleChange} required />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='name'>Company:</label>
            <input type='text' id='company' name='from_company' value={formData.from_company} onChange={handleChange} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='email'>
              Email<span style={sup}>*</span>:
            </label>
            <input
              type='email'
              id='email'
              name='from_email'
              value={formData.from_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='message'>Message:</label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleChange}
              rows={7}
              placeholder='HTML tags are not allowed in the message field.'
            />
          </div>
          <div className='flex flex-row gap-4 justify-end'>
            <button type='submit' className='btn-submit'>
              Submit
            </button>
            <button type='reset' className='btn' onClick={() => setFormData({ name: "", email: "", message: "" })}>
              Reset
            </button>
            <button
              type='button'
              className='btn'
              onClick={() => {
                if (window.history?.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/home"); // Replace '/home' with your desired route
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
