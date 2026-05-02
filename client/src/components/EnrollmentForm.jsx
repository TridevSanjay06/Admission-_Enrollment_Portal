import { useState } from 'react';
import { submitEnrollment } from '../services/api.js';

const initial = {
  parent_name: '',
  email: '',
  phone: '',
  city: '',
  grade: '',
  message: ''
};

export default function EnrollmentForm() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState(null);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessRef(null);
    setSubmitting(true);
    try {
      const data = await submitEnrollment({
        parent_name: form.parent_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        grade: form.grade,
        message: form.message.trim()
      });
      if (data.ok && data.reference_number) {
        setSuccessRef(data.reference_number);
        setForm(initial);
      }
    } catch (err) {
      let msg = err.message || 'There was an error submitting your application.';
      if (err.details && Array.isArray(err.details)) {
        msg = `Validation failed: ${err.details.map((d) => d.msg || d.message).join(', ')}`;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      {successRef && (
        <div
          style={{
            display: 'block',
            color: 'green',
            textAlign: 'center',
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#e8f5e9',
            borderRadius: '5px'
          }}
        >
          Thank you for your application! Reference: <strong>{successRef}</strong>. We will contact you soon.
        </div>
      )}
      {error && (
        <div
          style={{
            display: 'block',
            color: 'red',
            textAlign: 'center',
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#ffebee',
            borderRadius: '5px'
          }}
        >
          {error}
        </div>
      )}
      <form id="enrollment-form" onSubmit={onSubmit}>
        <input
          type="text"
          id="parent-name"
          name="parent_name"
          placeholder="Enter Parent Name *"
          required
          value={form.parent_name}
          onChange={(e) => update('parent_name', e.target.value)}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Parent's Email Address *"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter Parent's Contact Number"
          required
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Current City of Residence *"
          required
          value={form.city}
          onChange={(e) => update('city', e.target.value)}
        />

        <select
          id="grade"
          name="grade"
          required
          className="childs-block"
          value={form.grade}
          onChange={(e) => update('grade', e.target.value)}
        >
          <option value="">Select Child's Grade *</option>
          <option value="kg">Kindergarten</option>
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
        </select>

        <textarea
          id="message"
          name="message"
          placeholder="Enter Message"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'SUBMITTING…' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
}
