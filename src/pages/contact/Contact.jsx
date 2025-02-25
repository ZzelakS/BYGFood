import { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="10"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Send Message
          </button>
        </form>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Office</h2>
          <p>14B, Karimu Kotun, Victoria Island, Lagos, Nigeria</p>
          <p className="text-lg">Email: backyardgrill91@gmail.com</p>
          <p className="text-lg">Phone: +234-9168220671</p>
          <iframe
            title="Office Location"
            src="https://www.google.com/maps?q=14B+Karimu+Kotun,+Victoria+Island,+Lagos+Nigeria&output=embed"
            width="100%"
            height="300"
            className="rounded-xl border"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ContactUs;
