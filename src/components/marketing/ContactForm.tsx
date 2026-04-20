'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || 'website visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nWhat's on your mind:\n${message}`
    );
    window.location.href = `mailto:peta@beaconeffect.com.au?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="beacon-contact-form" noValidate>
      <div className="beacon-field">
        <label htmlFor="contact-name" className="beacon-label">
          Your Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="beacon-input"
        />
      </div>
      <div className="beacon-field">
        <label htmlFor="contact-email" className="beacon-label">
          Email Address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="beacon-input"
        />
      </div>
      <div className="beacon-field">
        <label htmlFor="contact-message" className="beacon-label">
          What&apos;s on your mind
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="beacon-input"
        />
      </div>
      <button type="submit" className="beacon-submit">
        Send me a message
      </button>
    </form>
  );
}
